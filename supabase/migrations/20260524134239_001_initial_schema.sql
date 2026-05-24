/*
  # CargoKube Initial Schema

  Creates the foundational tables for the Carbon Intelligence Platform

  1. New Tables
    - `users` - User profiles linked to Supabase auth
    - `clusters` - Kubernetes cluster configurations
    - `nodes` - Individual nodes within clusters
    - `workloads` - Kubernetes workloads scheduled on clusters
    - `carbon_data` - Historical and real-time carbon intensity data
    - `carbon_forecasts` - AI-generated carbon intensity predictions
    - `ai_recommendations` - AI scheduling recommendations
    - `cluster_metrics` - Time-series observability metrics
    - `notifications` - User notifications and alerts

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Read-only access for public carbon data

  3. Important Notes
    - All timestamps use timestamptz for proper timezone handling
    - UUID primary keys for security and uniqueness
    - Proper foreign key constraints for data integrity
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  organization text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_auth_user FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Clusters table
CREATE TABLE IF NOT EXISTS clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  region text NOT NULL,
  provider text DEFAULT 'aws',
  status text DEFAULT 'active',
  current_carbon_intensity numeric DEFAULT 0,
  renewable_percentage numeric DEFAULT 0,
  total_nodes integer DEFAULT 0,
  active_pods integer DEFAULT 0,
  co2_saved numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Nodes table
CREATE TABLE IF NOT EXISTS nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text DEFAULT 'ready',
  cpu_capacity numeric DEFAULT 0,
  cpu_usage numeric DEFAULT 0,
  memory_capacity_gb numeric DEFAULT 0,
  memory_usage_gb numeric DEFAULT 0,
  region text NOT NULL,
  carbon_intensity numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Workloads table
CREATE TABLE IF NOT EXISTS workloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  node_id uuid REFERENCES nodes(id) ON DELETE SET NULL,
  name text NOT NULL,
  namespace text DEFAULT 'default',
  workload_type text DEFAULT 'deployment',
  cpu_request numeric DEFAULT 0,
  memory_request_gb numeric DEFAULT 0,
  carbon_priority_score integer DEFAULT 50,
  sla_deadline_hours integer DEFAULT 24,
  status text DEFAULT 'running',
  created_at timestamptz DEFAULT now()
);

-- Carbon data table (historical and real-time)
CREATE TABLE IF NOT EXISTS carbon_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL,
  carbon_intensity numeric NOT NULL,
  renewable_percentage numeric DEFAULT 0,
  source text DEFAULT 'api',
  timestamp timestamptz DEFAULT now()
);

-- Carbon forecasts table (AI predictions)
CREATE TABLE IF NOT EXISTS carbon_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL,
  predicted_intensity numeric NOT NULL,
  prediction_confidence numeric DEFAULT 0,
  forecast_horizon_hours integer DEFAULT 24,
  recommended_window_start timestamptz,
  recommended_window_end timestamptz,
  created_at timestamptz DEFAULT now()
);

-- AI recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL,
  title text NOT NULL,
  description text,
  potential_co2_savings numeric DEFAULT 0,
  priority text DEFAULT 'medium',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Cluster metrics table (time-series observability)
CREATE TABLE IF NOT EXISTS cluster_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  metric_value numeric NOT NULL,
  unit text,
  timestamp timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluster_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for clusters
CREATE POLICY "Users can view own clusters"
  ON clusters FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own clusters"
  ON clusters FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own clusters"
  ON clusters FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own clusters"
  ON clusters FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for nodes
CREATE POLICY "Users can view nodes in own clusters"
  ON nodes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clusters
      WHERE clusters.id = nodes.cluster_id
      AND clusters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create nodes in own clusters"
  ON nodes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clusters
      WHERE clusters.id = nodes.cluster_id
      AND clusters.user_id = auth.uid()
    )
  );

-- RLS Policies for workloads
CREATE POLICY "Users can view workloads in own clusters"
  ON workloads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clusters
      WHERE clusters.id = workloads.cluster_id
      AND clusters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create workloads in own clusters"
  ON workloads FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clusters
      WHERE clusters.id = workloads.cluster_id
      AND clusters.user_id = auth.uid()
    )
  );

-- RLS Policies for carbon_data (public read)
CREATE POLICY "Carbon data is publicly readable"
  ON carbon_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Carbon data can be inserted by authenticated users"
  ON carbon_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for carbon_forecasts (public read)
CREATE POLICY "Carbon forecasts are publicly readable"
  ON carbon_forecasts FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for ai_recommendations
CREATE POLICY "Users can view recommendations for own clusters"
  ON ai_recommendations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clusters
      WHERE clusters.id = ai_recommendations.cluster_id
      AND clusters.user_id = auth.uid()
    )
  );

-- RLS Policies for cluster_metrics
CREATE POLICY "Users can view metrics for own clusters"
  ON cluster_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clusters
      WHERE clusters.id = cluster_metrics.cluster_id
      AND clusters.user_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX idx_clusters_user_id ON clusters(user_id);
CREATE INDEX idx_nodes_cluster_id ON nodes(cluster_id);
CREATE INDEX idx_workloads_cluster_id ON workloads(cluster_id);
CREATE INDEX idx_carbon_data_region_timestamp ON carbon_data(region, timestamp DESC);
CREATE INDEX idx_carbon_forecasts_region ON carbon_forecasts(region);
CREATE INDEX idx_cluster_metrics_cluster_timestamp ON cluster_metrics(cluster_id, timestamp DESC);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);

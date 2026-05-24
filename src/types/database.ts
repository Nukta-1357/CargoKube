export interface Cluster {
  id: string;
  user_id: string;
  name: string;
  region: string;
  provider: string;
  status: string;
  current_carbon_intensity: number;
  renewable_percentage: number;
  total_nodes: number;
  active_pods: number;
  co2_saved: number;
  created_at: string;
  updated_at: string;
}

export interface Node {
  id: string;
  cluster_id: string;
  name: string;
  status: string;
  cpu_capacity: number;
  cpu_usage: number;
  memory_capacity_gb: number;
  memory_usage_gb: number;
  region: string;
  carbon_intensity: number;
  created_at: string;
}

export interface Workload {
  id: string;
  cluster_id: string;
  node_id: string | null;
  name: string;
  namespace: string;
  workload_type: string;
  cpu_request: number;
  memory_request_gb: number;
  carbon_priority_score: number;
  sla_deadline_hours: number;
  status: string;
  created_at: string;
}

export interface CarbonData {
  id: string;
  region: string;
  carbon_intensity: number;
  renewable_percentage: number;
  source: string;
  timestamp: string;
}

export interface CarbonForecast {
  id: string;
  region: string;
  predicted_intensity: number;
  prediction_confidence: number;
  forecast_horizon_hours: number;
  recommended_window_start: string;
  recommended_window_end: string;
  created_at: string;
}

export interface AIRecommendation {
  id: string;
  cluster_id: string;
  recommendation_type: string;
  title: string;
  description: string;
  potential_co2_savings: number;
  priority: string;
  status: string;
  created_at: string;
}

export interface ClusterMetric {
  id: string;
  cluster_id: string;
  metric_type: string;
  metric_value: number;
  unit: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

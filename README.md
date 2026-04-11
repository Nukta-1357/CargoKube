 CargoKube AI
 Run compute when the grid is green

CargoKube AI is a carbon-aware Kubernetes scheduler that shifts workloads to low-carbon energy windows using predictive intelligence

 Problem
Cloud systems today are carbon-blind. They schedule workloads without considering whether the electricity powering them is clean or coal-heavy.
 Solution
CargoKube introduces carbon-aware scheduling by:
- Predicting grid carbon intensity
- Identifying "green windows"
- Dynamically shifting workloads within SLA limits
 How it Works

1. Carbon data is collected from grid sources  
2. AI predicts short-term carbon intensity  
3. Each workload gets a carbon priority score  
4. Scheduler delays or executes workloads accordingly  
 Tech Stack
- Kubernetes  
- Docker  
- Go (Scheduler Extension)  
- Python (Prediction Engine)  
- Prometheus + Grafana  

Demo (Work in Progress)
- Docker-based microservices running  
- Scheduler logic under development  
- Carbon-aware simulation in progress  

 Vision
Instead of scaling hardware, CargoKube optimizes *when* computation happens—reducing emissions without changing infrastructure.
 Status

 Currently in development for AlgoFest Hackathon 2026

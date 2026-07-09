pipeline {
    agent any

    environment {
        // Registry credentials or configurations can go here
        DOCKER_REGISTRY = ''
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build API Gateway') {
            steps {
                script {
                    docker.build("autoinsurance-apigateway:latest", "-f AutoInsurance.ApiGateway/Dockerfile .")
                }
            }
        }
        
        stage('Build Auth Service') {
            steps {
                script {
                    docker.build("autoinsurance-authservice:latest", "-f AutoInsurance.AuthService/Dockerfile .")
                }
            }
        }

        stage('Build Claim Service') {
            steps {
                script {
                    docker.build("autoinsurance-claimservice:latest", "-f AutoInsurance.ClaimService/Dockerfile .")
                }
            }
        }

        stage('Build Customer Service') {
            steps {
                script {
                    docker.build("autoinsurance-customerservice:latest", "-f AutoInsurance.CustomerService/Dockerfile .")
                }
            }
        }

        stage('Build Notification Service') {
            steps {
                script {
                    docker.build("autoinsurance-notificationservice:latest", "-f AutoInsurance.NotificationService/Dockerfile .")
                }
            }
        }

        stage('Build Policy Service') {
            steps {
                script {
                    docker.build("autoinsurance-policyservice:latest", "-f AutoInsurance.PolicyService/Dockerfile .")
                }
            }
        }

        stage('Build Vehicle Service') {
            steps {
                script {
                    docker.build("autoinsurance-vehicleservice:latest", "-f AutoInsurance.VehicleService/Dockerfile .")
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    docker.build("autoinsurance-frontend:latest", "-f Autoinsurance.Frontend/Dockerfile .")
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete'
        }
        success {
            echo 'All services built successfully.'
            // If you wanted to push to a registry, you would add docker.withRegistry(...) here
        }
        failure {
            echo 'One or more services failed to build.'
        }
    }
}

// Jenkinsfile
// Define o pipeline de Integração Contínua para o projeto React

pipeline {
   
    agent any

   
    tools {
        
        nodejs 'node18' 
    }

    
    environment {
        
        SONAR_HOST_URL = 'http://sonarqube:9000'
        
        SONAR_AUTH_TOKEN = credentials('SONAR_TOKEN') 
    }

    stages {
       
        stage('Install Dependencies') {
            steps {
               
                sh 'npm install'
            }
        }

       
        stage('Run Tests') {
            steps {
               
                sh 'npm test -- --coverage --watchAll=false'
            }
        }

       
        stage('SonarQube Analysis') {
            steps {
                
                sh "npm install -g sonarqube-scanner && sonar-scanner -Dsonar.login=$SONAR_AUTH_TOKEN"
            }
        }

        
        stage('SonarQube Quality Gate') {
            steps {
                
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

       
        stage('Build Application') {
            steps {
               
                sh 'npm run build'
            }
        }
    }
}

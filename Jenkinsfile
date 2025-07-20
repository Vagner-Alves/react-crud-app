
pipeline {
   
    agent any

   
    tools {
        
        nodejs 'node18' 
    }

    
    environment {
        
        
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
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
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

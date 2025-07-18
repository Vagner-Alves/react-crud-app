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

       
         // --- ETAPA CORRIGIDA ---
        stage('SonarQube Analysis') {
            steps {
                // O withSonarQubeEnv prepara o ambiente para a análise.
                // Ele injeta a URL do servidor e as credenciais automaticamente.
                // O nome do servidor ('SonarQube') deve corresponder ao configurado em
                // "Manage Jenkins" > "Configure System" > "SonarQube servers".
                // Se você não deu um nome, pode omitir o parâmetro.
                withSonarQubeEnv('SonarQube') {
                    // O comando do scanner agora é mais simples. Ele pega as configurações
                    // do ambiente preparado pelo withSonarQubeEnv.
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

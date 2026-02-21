pipeline {
    agent any

    environment {
        EC2_HOST = 'http://3.145.198.18/'
        PROJECT_ROOT = '/home/ubuntu/foodappjenkin'
        BACKEND_DIR = '/home/ubuntu/foodappjenkin/backend'

        AWS_DEFAULT_REGION = 'us-east-2'
        S3_BUCKET = 'frontendfood123'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Yashika-code/Foodappjenkin.git'
            }
        }

        // =========================
        // DEPLOY BACKEND
        // =========================
        stage('Deploy Backend to EC2') {
            steps {
                sshagent(['ec2-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                        cd ${PROJECT_ROOT} &&
                        git pull origin main &&

                        cd backend &&
                        npm install &&

                        pm2 delete frontendfood123 || true &&
                        pm2 start app.js --name frontendfood123 &&
                        pm2 save
                    '
                    """
                }
            }
        }

        // =========================
        // BUILD FRONTEND
        // =========================
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        // =========================
        // DEPLOY FRONTEND TO S3
        // =========================
        stage('Deploy Frontend to S3') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-s3-creds'
                ]]) {
                    sh '''
                        aws s3 sync frontend/build/ s3://$S3_BUCKET --delete
                    '''
                }
            }
        }
    }
}
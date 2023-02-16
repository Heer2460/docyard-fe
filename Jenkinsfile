pipeline {
    agent any
    stages {
        stage('Clone Code') {
            steps {
                checkout changelog: false, poll: false, scm: scmGit(branches: [[name: '*/devRemote']], extensions: [], userRemoteConfigs: [[credentialsId: '7032a7b7-8a6a-46db-8b20-947d4b955a1d', url: 'https://github.com/infotechirfannasim/docyard-fe.git']])
            }
        }
        stage('Build Code') {
            steps {
                // first time need to run npm install command
                // npm install
                 bat 'ng build --configuration production --aot --vendor-chunk --common-chunk --delete-output-path --build-optimizer --output-hashing=all --source-map=false'
            }
        }

        stage('Deploy Code') {
             steps {
                // Run Docker-Compose to build images and run services.
                bat 'docker-compose -f docker-compose.yml up -d'
            }
        }
    }
}

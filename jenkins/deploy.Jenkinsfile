DOCKER_REGISTRY = '192.168.50.55:8082';
IMAGE_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}".replaceAll(/[^a-zA-Z0-9-_]/, '-');
APP_IMAGE_NAME = "${DOCKER_REGISTRY}/homemap-api:${IMAGE_TAG}";
API_IMAGE_NAME = "${DOCKER_REGISTRY}/homemap-app:${IMAGE_TAG}";

def runPipeline() {
    stage('Checkout SCM') {
        checkout scm
    }

    stage('Build API image') {
        sh "docker build . -f docker/Dockerfile.api -t ${API_IMAGE_NAME}"
    }

    stage('Build APP image') {
        sh "docker build . -f docker/Dockerfile.app -t ${APP_IMAGE_NAME}"
    }

    stage('Auth') {
        withCredentials([usernamePassword(credentialsId: 'docker', usernameVariable: 'user', passwordVariable: 'password')]) {
            sh "docker login -u ${user} -p ${password} ${DOCKER_REGISTRY}"
        }
    }

    stage('Publish API image') {
        sh "docker push ${API_IMAGE_NAME}"
    }

    stage('Publish APP image') {
        sh "docker push ${APP_IMAGE_NAME}"
    }
}

node('agent1') {
    runPipeline()
}

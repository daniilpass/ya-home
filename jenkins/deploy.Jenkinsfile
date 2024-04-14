DOCKER_REGISTRY = '192.168.50.55:8082';

def buildAndDeploy() {
    stage('Build image: API') {
        sh "docker build . -f docker/Dockerfile.api -t ${DOCKER_REGISTRY}/homemap-api:latest"
    }

    stage('Build image: APP') {
        sh "docker build . -f docker/Dockerfile.app -t ${DOCKER_REGISTRY}/homemap-app:latest"
    }
}

node('agent1') {
    buildAndDeploy()
}

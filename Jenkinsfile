node {
  stage('SCM') {
    checkout scm
  }
  stage('Build') {
    dir('code/darkboard-backend') {
      sh 'mvn clean install -DskipTests'
    }
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScannerMaven';
    withSonarQubeEnv() {
        sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}

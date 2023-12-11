node {
  stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'SonarScannerMaven';
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
}

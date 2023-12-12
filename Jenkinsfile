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
      dir('code/darkboard-backend') {
        sh "${scannerHome}/bin/sonar-scanner Dsonar.projectKey=balottacpp_T5-omega-chess_AYxUXnSkqW6VennScxft -Dsonar.java.binaries=target/classes"
      }
    }
  }
}

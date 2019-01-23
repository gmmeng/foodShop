pipeline {
  agent any
  stages {
    stage('Git Commit Trigger') {
      steps {
        git(url: 'https://github.com/gmmeng/foodShop', branch: 'master', poll: true)
      }
    }
    stage('Unit Tests') {
      steps {
        bat 'cd H:\\junitreportgeneration'
        bat 'mvn clean install'
      }
    }
    stage('Cucumber Test') {
      steps {
        bat 'cd C:\\Users\\gabriel.moreira\\Desktop\\CucumberExample\\CucumberExample'
        bat 'mvn clean install'
      }
    }
    stage('Deployment') {
      steps {
        echo 'Starting deployment'
      }
    }
  }
  environment {
    Development = 'Windows 7'
  }
}
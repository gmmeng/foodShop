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
        echo 'Unit Testing'
      }
    }
    stage('Cucumber Test') {
      steps {
        echo 'Feature Testing/Cucumber Test'
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
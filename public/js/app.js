const app = new Vue({
  el: '#app',
  methods: {
    writeConfig() {
      const policyData = {
        "timestamp": "",
        "watching": {
          "interval": 250,
          "idle": {
            "enabled": true,
            "in": 600000,
            "awake": 5000
          },
          "process": {
            "enabled": true,
            "browsers": [
              "chrome.exe",
              "msedge.exe",
              "iexplore.exe",
              "whale.exe",
              "filefox.exe",
              "opera.exe"
            ],
            "excludes": [
              "explorer.exe",
              "*host.exe",
              "*broker.exe",
              "taskmgr.exe",
              "debugview.exe",
              "baretail.exe",
              "lockapp.exe",
              "searchapp.exe"
            ],
            "privates": [
              "kakaotalk.exe"
            ]
          },
          "fileIo": {
            "enabled": true,
            "excludes": [
              "*\\$*",
              "*\\program files*",
              "*\\windows\\*",
              "*\\users\\*",
              "*\\system volume information\\*"
            ],
            "extensions": [
              ".log",
              ".txt",
              ".ppt*",
              ".doc*",
              ".xls*"
            ]
          },
          "print": {
            "enabled": true
          }
        },
        "detection": {
          "enabled": true,
          "interval": 10800000
        }
      }
      axios.post('/writePolicyFile', policyData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
})
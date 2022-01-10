const requireDataComponent = () => ({
  init: function () {
    require.config({
                    waitSeconds : 0,
                    paths : {
                      text: '../lib/text',
                      json: '../src/json'
                    }
                });

    require(['json!config.json','json!data.json'], function(configData, dataData){
      var deviceDataRaw = configData
      var testDataRaw = dataData
      document.querySelector('a-scene').setAttribute('experiencemanager', {
        deviceDataIn: `${JSON.stringify(deviceDataRaw)}`,
        testDataIn: `${JSON.stringify(testDataRaw)}`,
      })
    })
  },
})
export {requireDataComponent}

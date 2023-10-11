<template>
  <div id="map" style="height:100%;width: 100%;">
    <button id="data1" @click="loaddata1">永久农田几何对象</button>
    <button id="data2" @click="loaddata2">城市建设几何对象</button>
    <button id="overlap" @click="overlap">叠加分析</button>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import axios from 'axios'
export default {
  name: 'HomeView',
  data() {
    return {
      map: null // 初始化 map 为 null
    };
  },
  mounted() {
    this.initmap()
  },
  methods: {
    initmap() {
      // 创建地图实例
      this.map = L.map('map', {
        crs: L.CRS.EPSG3857,
        center: [0, 0],
        zoom: 4
      });
      // 添加基础地图图层
      var layer = L.tileLayer('http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=	00a0eb37ce20466034702928f409754a'
      ).addTo(this.map);
      console.log(layer)
      var layer_tip = L.tileLayer('http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=00a0eb37ce20466034702928f409754a'
      ).addTo(this.map);
      layer_tip.setZIndex(1000);
      const feature=L.circle([-8232910.23,4966473.77]).addTo(this.map);
      this.map.setView(feature.getLatLng(), 15); // 第二个参数是缩放级别
    },
    onEachFeature(feature, layer) {
      var tip = feature.properties;
      if (tip != null) {
        var tipText = "";
        if (tip.id != null) {
          var color = tip.color;
          if (color == null) color = "black";
          tipText += "<h3 style='color:" + color + "'>" + tip.id + "</h3>";
        }
        var objInfo = tip;
        console.log(objInfo)
        if (objInfo != null && Object.keys(objInfo).length > 0) {
          tipText += "<table>";
          for (var propName in objInfo) {
            tipText += "<tr><td>" + propName + "</td><td>" + objInfo[propName] + "</td></tr>";
          }
          tipText += "</table>";
        } else {
          tipText += "<i>No information present</i>";
        }
        layer.bindPopup(tipText);
      }
    },
    loaddata1() {
      axios.get('http://localhost:3000/ground')
        .then((response) => {
          // 请求成功时的处理
          const data = response.data;
          console.log(data)
          const vectorLayer = L.geoJSON(data, {
            onEachFeature: this.onEachFeature,
          });
          vectorLayer.setStyle({
            fillColor: '#C1FFC1',      // 填充颜色
            color: '#C1FFC1',
            weight: 2,              // 边框宽度
            opacity: 1,           // 不透明度
          });
          vectorLayer.addTo(this.map)
          this.map.fitBounds(vectorLayer.getBounds())
        })
        .catch((error) => {
          // 请求失败时的处理
          console.error('请求失败：', error);
        });
    },
    loaddata2() {
      axios.get('http://localhost:3000/city')
        .then((response) => {
          // 请求成功时的处理
          const data = response.data;
          console.log(data)
          const vectorLayer = L.geoJSON(data, {
            onEachFeature: this.onEachFeature
          });
          vectorLayer.setStyle({
            fillColor: 'blue',      // 填充颜色
            color: 'blue',
            weight: 2,              // 边框宽度
            opacity: 1,           // 不透明度
          });
          vectorLayer.addTo(this.map)
          this.map.fitBounds(vectorLayer.getBounds())
        })
        .catch((error) => {
          // 请求失败时的处理
          console.error('请求失败：', error);
        });
    },
    overlap() {
      axios.get('http://localhost:3000/overlap')
        .then((response) => {
          // 请求成功时的处理
          const data = response.data;
          console.log(data)
          const vectorLayer3 = L.geoJSON(data, {
            onEachFeature: this.onEachFeature
          })
          vectorLayer3.setStyle({
            fillColor: 'red',      // 填充颜色
            color: 'red',
            weight: 2,              // 边框宽度
            opacity: 1,           // 不透明度
          });
          vectorLayer3.addTo(this.map);
          this.map.fitBounds(vectorLayer3.getBounds());
        })
        .catch((error) => {
      // 请求失败时的处理
      console.error('请求失败：', error);
    });
  }
}
}
</script>
<style>
#map {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}

#data1 {
  display: inline-block;
  width: 130px;
  height: 50px;
  right: 10px;
  top: 20px;
  position: absolute;
  z-index: 999;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#data2 {
  display: inline-block;
  width: 130px;
  height: 50px;
  right: 10px;
  top: 90px;
  position: absolute;
  z-index: 999;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#overlap {
  display: inline-block;
  width: 130px;
  height: 50px;
  right: 10px;
  top: 160px;
  position: absolute;
  z-index: 999;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#map>button:hover {
  background-color: #2980b9;
}
</style>
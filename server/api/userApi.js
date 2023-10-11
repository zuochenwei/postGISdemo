const express = require('express');
const router = express.Router();
const pool = require('../db'); // 引入数据库连接配置

// 示例路由处理程序，执行查询
router.get('/city', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
      json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
          json_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(geom)::json,
            'properties', json_build_object(
              'id', gid,  -- 替换 gid 为你的属性列名
              'color', '#C1FFC1'  -- 颜色属性，可以自定义
            )
          )
        )
      ) AS geojson
    FROM
     city;
  `);
  res.json(result.rows[0].geojson); // 使用正确的属性名称 geojson
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
router.get('/ground', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
      json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
          json_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(geom)::json,
            'properties', json_build_object(
              'id', gid,  -- 替换 gid 为你的属性列名
              'color', '#0000ff'  -- 颜色属性，可以自定义
            )
          )
        )
      ) AS geojson
    FROM
      ground;
  `);
  res.json(result.rows[0].geojson); // 使用正确的属性名称 geojson
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
router.get('/overlap', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
    json_build_object(
      'type', 'FeatureCollection',
      'features', json_agg(
        json_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(geom)::json,
          'properties', json_build_object(
            'id', gid,
            'color', 'red'
          )
        )
      )
    ) AS geojson
  FROM (
	 SELECT g.gid,ST_Intersection(g.geom,c.geom) AS geom
	FROM city c,ground g
	WHERE ST_Intersects(g.geom,c.geom)
  ) AS distinct_features;
  `);
  res.json(result.rows[0].geojson); // 使用正确的属性名称 geojson
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
module.exports = router;

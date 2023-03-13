# Changelog for grafana-metric

## v1.2.0 (2023/03/13)

### Features / enhancements

- Add method to filter by series name, field name and multiple labels [#35](https://github.com/gapitio/grafana-metric/pull/35)

## v1.1.1 (2022/01/07)

### Features / enhancements

- Check if field contains displayName if name fails [#29](https://github.com/gapitio/grafana-metric/pull/29)

## v1.1.0 (2021/08/03)

### Features / enhancements

- Use values if calcs is missing [#28](https://github.com/gapitio/grafana-metric/pull/28)

## v1.0.1 (2021/08/03)

### Bug fixes

- Fix wrong time returned [#27](https://github.com/gapitio/grafana-metric/pull/27)

## v1.0.0 (2021/03/05)

### Features / enhancements

- Add reducer ids [#13](https://github.com/gapitio/grafana-metric/pull/13)
- Add metricData which retrieves multiple calcs (last, min, max, first, ETC) and time [#18](https://github.com/gapitio/grafana-metric/pull/18)

## v0.2.0 (2021/02/24)

### Features / enhancements

- Add get metric from field names [#5](https://github.com/gapitio/grafana-metric/pull/5)
- Add get metric from label [#6](https://github.com/gapitio/grafana-metric/pull/6)
- Export unused functions (getFieldByName, getSeriesByName, getValueField) [#10](https://github.com/gapitio/grafana-metric/pull/10)

## v0.1.0 (2021/02/05)

### Features / enhancements

- Add getEvaluationString which evaluates a string with metric names
- Add better descriptions and examples

## v0.0.2 (2021/02/01)

### Bug fixes

- Fix missing noDataValue parameter

## v0.0.1 (2020/11/19)

### Features / enhancements

- Add getShowcaseMetricValue which returns a value between a set range of numbers with a set amount of decimals.
- Add getMetricValue which decides what function to run.

## v0.0.0 (2020/11/06)

### Features / enhancements

- Add getMetricValueByName which retrieves last metric value based off of the name provided.

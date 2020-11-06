# HTMLGraphics metric

Retrieves metric value from Grafana's [data interface](https://grafana.com/docs/grafana/latest/packages_api/data/paneldata/).

## Usage

### getMetricValueByName

Retrieves last metric value based off of the name provided.

```ts
import { getMetricValueByName } from "@gapit/grafana-metric";

getMetricValueByName("metric-name"); // Returns metric value
```

# HTMLGraphics metric

Retrieves metric value from Grafana's [data interface](https://grafana.com/docs/grafana/latest/packages_api/data/paneldata/).

## Usage

### getEvaluatedString

Evaluates a metric string

```ts
import { getEvaluatedString } from "@gapit/grafana-metric";

// random-metric = 100

getEvaluatedString("'random-metric' * 2"); // Returns 200
getEvaluatedString("Math.sqrt('random-metric')"); // Returns 10
```

### getShowcaseMetricValue

Generate a random number

```ts
import { getShowcaseMetricValue } from "@gapit/grafana-metric";

getShowcaseMetricValue(); // Returns a value between 0 and 1000 with 2 decimals
getShowcaseMetricValue({ range: [x, y], decimals: z }); // Return a random value between x and y with z decimals.
```

### getMetricValueByName

Gets a metric value by name/alias

```ts
import { getMetricValueByName } from "@gapit/grafana-metric";

// metric-name = 100

getMetricValueByName("metric-name"); // Returns 100
getMetricValueByName("non-existing-metric"); // Returns null
getMetricValueByName("non-existing-metric", { noDataValue: "No data" }); // Returns "No data"
```

### getMetricValue

Function provides calculations for grafana queries.

```ts
import { getMetricValue } from "@gapit/grafana-metric";

// metric-name = 100

// By name
getMetricValue("metric-name"); // Returns 100

// No data
getMetricValue("non-existing-metric"); // Returns null
getMetricValue("non-existing-metric", false, [0, 10], 2, "No data"); // Returns "No data"

// Evaluation string
getMetricValue("'metric-name' * 2"); // Returns 200
getMetricValue("Math.sqrt('metric-name')"); // Returns 10

// Showcase
getMetricValue("metric-name", true); // Returns a random value between 0 and 1000.
getMetricValue("metric-name", true, [1, 10]); // Returns random value between 1-10.
getMetricValue("metric-name", true, [1, 10], 4); // Returns random value between 1-10 with 4 decimals.
```

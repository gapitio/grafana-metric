# HTMLGraphics metric

Retrieves metric value from Grafana's [data interface](https://grafana.com/docs/grafana/latest/packages_api/data/paneldata/).

## Usage

The main difference between MetricValue and MetricData is that MetricValue is a single value while MetricData is an object

```ts
type MetricValue = unknown;

interface TimeData {
  first?: unknown;
  last?: unknown;
}

interface MetricData {
  calcs: { [key: string]: unknown };
  time: TimeData;
  hasData: boolean;
}
```

### getMetricValueFromExpression

Evaluates a metric expression

```ts
import { getMetricValueFromExpression } from "@gapit/grafana-metric";

// random-metric = 100

getMetricValueFromExpression("'random-metric' * 2"); // Returns 200
getMetricValueFromExpression("Math.sqrt('random-metric')"); // Returns 10
```

### getShowcaseMetricValue

Generate a random number

```ts
import { getShowcaseMetricValue } from "@gapit/grafana-metric";

getShowcaseMetricValue(); // Returns a value between 0 and 1000 with 2 decimals
getShowcaseMetricValue({ range: { min: x, max: y }, decimals: z }); // Return a random value between x and y with z decimals.
```

### getMetricValueFromName

Gets a metric value by name/alias

```ts
import { getMetricValueFromName } from "@gapit/grafana-metric";

// metric-name = 100

getMetricValueFromName("metric-name"); // Returns 100
getMetricValueFromName("non-existing-metric"); // Returns null
getMetricValueFromName("non-existing-metric", { noDataValue: "No data" }); // Returns "No data"
```

### getMetricValue

Function provides calculations for grafana queries.

```ts
import { getMetricValue } from "@gapit/grafana-metric";

// metric-name = 100

// From name
getMetricValue("metric-name"); // Returns 100

// No data
getMetricValue("non-existing-metric"); // Returns null
getMetricValue("non-existing-metric", { noDataValue: "No data" }); // Returns "No data"

// Evaluation string
getMetricValue("'metric-name' * 2"); // Returns 200
getMetricValue("Math.sqrt('metric-name')"); // Returns 10

// Showcase
getMetricValue("metric-name", { showcase: true }); // Returns a random value between 0 and 1000.
getMetricValue("metric-name", { showcase: true, range: { min: 0, max: 10 } }); // Returns random value between 1-10.
getMetricValue("metric-name", {
  showcase: true,
  range: { min: 0, max: 10 },
  decimals: 4,
}); // Returns random value between 1-10 with 4 decimals.
```

### getMetricDataFromExpression

Evaluates a metric expression

### getShowcaseMetricData

Generates a random metric data object

### getMetricDataFromName

Gets metric data by name/alias

### getMetricData

Gets metric data

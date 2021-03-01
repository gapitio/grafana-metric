import { ReducerID } from "../field";

import { getShowcaseMetricData } from "./getShowcaseMetricData";

describe("getShowcaseMetricData", () => {
  describe("default options", () => {
    it("retrieves random value (random = 0.4)", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.4);

      expect(getShowcaseMetricData()).toStrictEqual({
        calcs: {
          [ReducerID.allIsNull]: false,
          [ReducerID.allIsZero]: false,
          [ReducerID.count]: 400,
          [ReducerID.delta]: 400,
          [ReducerID.diff]: 400,
          [ReducerID.first]: 400,
          [ReducerID.firstNotNull]: 400,
          [ReducerID.last]: 400,
          [ReducerID.lastNotNull]: 400,
          [ReducerID.logmin]: 400,
          [ReducerID.max]: 400,
          [ReducerID.mean]: 400,
          [ReducerID.min]: 400,
          [ReducerID.range]: 400,
          [ReducerID.step]: 400,
          [ReducerID.sum]: 400,
        },
        time: {
          [ReducerID.first]: 1590485760,
          [ReducerID.last]: 1598075136,
        },
        hasData: true,
      });

      jest.spyOn(global.Math, "random").mockRestore();
    });
    it("retrieves random value (random = 0.6)", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.6);

      expect(getShowcaseMetricData()).toStrictEqual({
        calcs: {
          [ReducerID.allIsNull]: true,
          [ReducerID.allIsZero]: true,
          [ReducerID.count]: 600,
          [ReducerID.delta]: 600,
          [ReducerID.diff]: 600,
          [ReducerID.first]: 600,
          [ReducerID.firstNotNull]: 600,
          [ReducerID.last]: 600,
          [ReducerID.lastNotNull]: 600,
          [ReducerID.logmin]: 600,
          [ReducerID.max]: 600,
          [ReducerID.mean]: 600,
          [ReducerID.min]: 600,
          [ReducerID.range]: 600,
          [ReducerID.step]: 600,
          [ReducerID.sum]: 600,
        },
        time: {
          [ReducerID.first]: 1596810240,
          [ReducerID.last]: 1604399616,
        },
        hasData: true,
      });

      jest.spyOn(global.Math, "random").mockRestore();
    });
  });

  describe("reducer ids", () => {
    beforeEach(() => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.5);
    });

    afterEach(() => {
      jest.spyOn(global.Math, "random").mockRestore();
    });

    it("retrieves correct calcs", () => {
      expect(
        getShowcaseMetricData({ reducerIDs: [ReducerID.last] })
      ).toStrictEqual({
        calcs: {
          [ReducerID.last]: 500,
        },
        time: {
          [ReducerID.first]: 1593648000,
          [ReducerID.last]: 1601553600,
        },
        hasData: true,
      });
    });
  });

  describe("showcaseCalcs", () => {
    beforeEach(() => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.5);
    });

    afterEach(() => {
      jest.spyOn(global.Math, "random").mockRestore();
    });

    it("retrieves correct calcs", () => {
      expect(
        getShowcaseMetricData({
          showcaseCalcs: {
            [ReducerID.last]: { min: 10, max: 20 },
            [ReducerID.first]: { min: 0, max: 20 },
          },
        })
      ).toStrictEqual({
        calcs: {
          [ReducerID.first]: 10,
          [ReducerID.last]: 15,
        },
        time: {
          [ReducerID.first]: 1593648000,
          [ReducerID.last]: 1601553600,
        },
        hasData: true,
      });
      expect(
        getShowcaseMetricData({
          reducerIDs: [ReducerID.last],
          showcaseCalcs: {
            [ReducerID.last]: { min: 10, max: 20 },
            [ReducerID.first]: { min: 0, max: 20 },
          },
        })
      ).toStrictEqual({
        calcs: {
          [ReducerID.last]: 15,
        },
        time: {
          [ReducerID.first]: 1593648000,
          [ReducerID.last]: 1601553600,
        },
        hasData: true,
      });
    });
  });

  describe("decimals", () => {
    beforeEach(() => {
      jest.spyOn(global.Math, "random").mockReturnValue(1 / 3);
    });

    afterEach(() => {
      jest.spyOn(global.Math, "random").mockRestore();
    });

    it("retrieves correct amount of decimals", () => {
      expect(
        getShowcaseMetricData({ reducerIDs: [ReducerID.last], decimals: 5 })
      ).toStrictEqual({
        calcs: {
          [ReducerID.last]: 333.33333,
        },
        time: {
          [ReducerID.first]: 1588377600,
          [ReducerID.last]: 1595404800,
        },
        hasData: true,
      });
      expect(
        getShowcaseMetricData({ reducerIDs: [ReducerID.last] })
      ).toStrictEqual({
        calcs: {
          [ReducerID.last]: 333.33,
        },
        time: {
          [ReducerID.first]: 1588377600,
          [ReducerID.last]: 1595404800,
        },
        hasData: true,
      });
    });
  });
});

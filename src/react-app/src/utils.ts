let idNum = 10000;

export abstract class Utils {
  static classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  static generateUUID() {
    if (crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    if (crypto && crypto.getRandomValues) {
      console.log(
        "crypto.randomUUID is not available using crypto.getRandomValues"
      );

      return ("" + [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        (ch) => {
          let c = Number(ch);
          return (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16);
        }
      );
    }

    console.log("crypto is not available");
    let date1 = new Date().getTime();
    let date2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16;
        if (date1 > 0) {
          r = (date1 + r) % 16 | 0;
          date1 = Math.floor(date1 / 16);
        } else {
          r = (date2 + r) % 16 | 0;
          date2 = Math.floor(date2 / 16);
        }

        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  static generateId() {
    const id = `0${new Date().getTime()}${Math.floor(
      Math.random() * 10000
    )}${++idNum}`;

    return id;
  }

  static moveArrayElement<T>(array: Array<T>, element: T, delta: number) {
    const index = array.indexOf(element);
    const newIndex = index + delta;

    if (newIndex >= array.length) {
      let i = newIndex - array.length + 1;
      while (i--) {
        array.push(element);
      }
    }

    array.splice(newIndex, 0, array.splice(index, 1)[0]);

    return array;
  }

  static unique<T>(array: Array<T>) {
    return Array.from(new Set(array));
  }

  static isUpperCase(value: string) {
    return value.toString() === value.toUpperCase();
  }

  static firstLetterToUpperCase(value: string = "") {
    if (!value) return "";

    return value[0].toUpperCase() + value.slice(1);
  }

  static isNumeric(value: string) {
    return /^-?\d+$/.test(value);
  }

  static deepMerge(target: any, source: any, isMergingArrays: boolean = false) {
    target = ((obj) => {
      let cloneObj;
      try {
        cloneObj = JSON.parse(JSON.stringify(obj));
      } catch (err) {
        cloneObj = Object.assign({}, obj);
      }
      return cloneObj;
    })(target);

    const isObject = (obj: any) => obj && typeof obj === "object";
    if (!isObject(target) || !isObject(source)) return source;

    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        if (isMergingArrays) {
          target[key] = targetValue.map((x, i) =>
            sourceValue.length <= i
              ? x
              : this.deepMerge(x, sourceValue[i], isMergingArrays)
          );
          if (sourceValue.length > targetValue.length)
            target[key] = target[key].concat(
              sourceValue.slice(targetValue.length)
            );
        } else {
          target[key] = targetValue.concat(sourceValue);
        }
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = this.deepMerge(
          Object.assign({}, targetValue),
          sourceValue,
          isMergingArrays
        );
      } else {
        target[key] = sourceValue;
      }
    });

    return target;
  }

  static sortVersions(versions: string[]) {
    return versions
      .map((a) =>
        a
          .split(".")
          .map((n) => +n + 100000)
          .join(".")
      )
      .sort()
      .map((a) =>
        a
          .split(".")
          .map((n) => +n - 100000)
          .join(".")
      );
  }
}

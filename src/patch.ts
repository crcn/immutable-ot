import { Mutation, MutationType } from "./mutations";
import { getValue, arraySplice, setValue } from "./utils";


type PatchAdapter = {
  getDeepValue(object, path: any[]): any;
  setDeepValue(value, path: any[], object): any;
};

const defaultPatchAdapter = {
  getDeepValue: getValue,
  setDeepValue: setValue,
}

export const patch = <TValue>(oldValue: TValue, mutations: Mutation[], {getDeepValue, setDeepValue}: PatchAdapter = defaultPatchAdapter) => {
  let newValue = oldValue;

  for (let i = 0, n = mutations.length; i < n; i++) {
    const mutation = mutations[i];
    let target = getDeepValue(newValue, mutation.path);

    switch (mutation.type) {
      case MutationType.INSERT: {
        target = arraySplice(target, mutation.index, 0, mutation.value);
        break;
      }
      case MutationType.REMOVE: {
        target = arraySplice(target, mutation.index, 1);
        break;
      }
      case MutationType.REPLACE: {
        target = mutation.value;
        break;
      }
      case MutationType.MOVE: {
        const value = target[mutation.oldIndex];
        target = arraySplice(target, mutation.oldIndex, 1);
        target = arraySplice(target, mutation.newIndex, 0, value);
        break;
      }
      case MutationType.SET: {
        target = { ...target, [mutation.propertyName]: mutation.value };
        break;
      }
      case MutationType.UNSET: {
        target = { ...target};
        delete target[mutation.propertyName]
        break;
      }
    }

    newValue = setDeepValue(newValue, target, mutation.path);
  }

  return newValue;
};

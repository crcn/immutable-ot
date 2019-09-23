import { expect } from "chai";
import { diff, MutationType, patch } from "..";
import { generateRandomNode } from "./utils"; 

describe(__filename + "#", () => {

  Array
    .from({ length: 200 })
    .map(() => [
      generateRandomNode(5, 7, 5), 
      generateRandomNode(5, 7, 5)
    ])
    .forEach(([a, b]) => {
      it(`Can diff & patch ${JSON.stringify(a)} to ${JSON.stringify(b)}`,  () => {
        const now = Date.now();
        const diffs = diff(a, b);
        const c = patch(a, diffs);
        expect(c).to.eql(b);
      });
    });
});

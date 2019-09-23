enum NodeType {
  TEXT,
  ELEMENT
};

type Attribute = {
  name: string;
  value: string;
}

type BaseNode<TType extends NodeType> = {
  type: TType,
};

type Element = {
  attributes: Attribute[],
  children: Node
} & BaseNode<NodeType.ELEMENT>;

type Text = {
  value: string;
} & BaseNode<NodeType.TEXT>;

export type Node = Element | Text;

export const generateRandomNode = (maxDepth: number = 5, maxChildren: number = 5, maxAttributes = 5, currentDepth: number = 0) => {
  if (Math.round(Math.random())) {    
    return {
      type: NodeType.TEXT,
      value: getRandomCharacter()
    }
  }
  return {
    type: NodeType.ELEMENT,
    attributes: Array.from({ length: Math.round(Math.random() * maxAttributes) }).map(() => {
      return { name: getRandomCharacter(), value: getRandomCharacter() }
    }),
    children: currentDepth === maxDepth ? [] : Array.from({ length: Math.round(Math.random() * maxChildren) }).map(() => {
      return generateRandomNode(maxDepth, maxChildren, maxAttributes, currentDepth + 1);
    })
  };
};

const chars = 'abcdefghijklm';

const getRandomCharacter = () => {
  return chars.charAt(Math.floor(Math.random() * chars.length));
}
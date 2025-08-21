export type BstNode<T> = {
  key: T;
  left: BstNode<T> | null;
  right: BstNode<T> | null;
};

export type InsertStep<T> = {
  type: "compare" | "descend-left" | "descend-right" | "insert";
  key: T;
  at?: T;
};

export function* bstInsertSteps<T>(
  root: BstNode<T> | null,
  key: T,
  compare: (a: T, b: T) => number
): Generator<InsertStep<T>, BstNode<T>> {
  if (!root) {
    yield { type: "insert", key };
    return { key, left: null, right: null };
  }

  let parent: BstNode<T> | null = null;
  let current: BstNode<T> | null = root;
  while (current) {
    yield { type: "compare", key, at: current.key };
    const cmp = compare(key, current.key);
    parent = current;
    if (cmp < 0) {
      yield { type: "descend-left", key, at: current.key };
      current = current.left;
    } else if (cmp > 0) {
      yield { type: "descend-right", key, at: current.key };
      current = current.right;
    } else {
      // No duplicates; treat as no-op
      return root;
    }
  }

  if (!parent) return root;
  const newNode: BstNode<T> = { key, left: null, right: null };
  if (compare(key, parent.key) < 0) parent.left = newNode;
  else parent.right = newNode;
  yield { type: "insert", key, at: parent.key };
  return root;
}

import { helper } from '@ember/component/helper';

export function artPieceCheck([id1, id2]) {
  return id1 === id2;
}

export default helper(artPieceCheck);

export class Feed {
  id: string
  userId    : string
  created   : BigInt
  content   : string
  comments  : Comment[]   = [];
  likes     : string[]    = [];
  loadComments : boolean = false;
}

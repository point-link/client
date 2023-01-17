export interface Account {
  uid: number
  username: string
  profile: {
    avatar?: string
    nickname?: string
  }
}

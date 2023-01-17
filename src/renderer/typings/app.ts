export interface Profile {
  avatar?: string
  nickname?: string
}

export interface Account {
  uid: number
  username: string
  profile: Profile
}

export interface Friend {
  uid: number
  tags: string[]
  remark?: string
  description?: string
  username: string
  profile: Profile
}

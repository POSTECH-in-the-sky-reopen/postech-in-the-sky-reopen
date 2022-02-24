import { ConnectionOptions } from "typeorm"
import { Cell } from 'src/entity/Cell'
import { Item,
  EquipableItem, WeaponEquipableItem, AccessoryEquipableItem,
  CoordiItem, FaceCoordiItem, HairCoordiItem, SuitCoordiItem, DecoCoordiItem,
  EnchantItem,
} from 'src/entity/Item'
import { ItemInfo, 
  EquipableItemInfo, WeaponEquipableItemInfo, AccessoryEquipableItemInfo, 
  CoordiItemInfo, FaceCoordiItemInfo, HairCoordiItemInfo, SuitCoordiItemInfo, DecoCoordiItemInfo, 
  EnchantItemInfo,
} from 'src/entity/ItemInfo'
import { BossMonsterInfo, MonsterInfo } from "src/entity/MonsterInfo"
import { Player } from 'src/entity/Player'
import { Region } from 'src/entity/Region'
import { User } from 'src/entity/User'
import { Siege } from "src/entity/Siege"
import { Phase } from "src/entity/Phase"
import { ItemCollection } from "src/entity/ItemCollection"
import { GroupInfo } from "src/entity/GroupInfo"
import { Achievement } from "src/entity/Achievement"
import { Honored } from "src/entity/Honored"

const ormconfig: ConnectionOptions = {
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  logging: false,
  entities: [
    Cell,
    Item, 
    EquipableItem, WeaponEquipableItem, AccessoryEquipableItem,
    EnchantItem,
    CoordiItem, FaceCoordiItem, HairCoordiItem, SuitCoordiItem, DecoCoordiItem,
    ItemInfo, 
    EquipableItemInfo, WeaponEquipableItemInfo, AccessoryEquipableItemInfo, 
    CoordiItemInfo, FaceCoordiItemInfo, HairCoordiItemInfo, SuitCoordiItemInfo, DecoCoordiItemInfo,
    EnchantItemInfo,
    MonsterInfo, BossMonsterInfo,
    Siege, Phase,
    Achievement, Honored,
    ItemCollection,
    GroupInfo,
    Player,
    Region,
    User,
  ],
  migrations: ["src/migration/**/*.js"],
  subscribers: ["src/subscriber/**/*.js"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
}

export default ormconfig

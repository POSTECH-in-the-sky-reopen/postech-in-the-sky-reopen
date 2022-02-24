import { GroupInfo } from "src/entity/GroupInfo";
import { ItemCollection } from "src/entity/ItemCollection";
import { ItemInfo } from "src/entity/ItemInfo";
import { addMark } from "src/util/Mark";
import { EntityRepository, Repository, UpdateResult } from "typeorm";

@EntityRepository(ItemCollection)
export class ItemCollectionRepository extends Repository<ItemCollection> {
    
    async createAndSave(
        name: string,
        itemInfos: ItemInfo[],
    ): Promise<ItemCollection> {
        const itemCollection = new ItemCollection();
        itemCollection.name = name
        itemCollection.itemInfos = itemInfos
        return this.manager.save(itemCollection);
    }

    async addItemInfos(
        id: number,
        itemInfos: ItemInfo[]
    ): Promise<UpdateResult>{
        return this.createQueryBuilder()
            .update(ItemCollection)
            .set({
                itemInfos: itemInfos
            })
            .where({ id: id })
            .execute();
    }
}

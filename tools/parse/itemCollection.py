from parse.data import parse_tsv

def parse_collections():
    ret = []
    collection_info_table = parse_tsv(f"tools/data/itemCollection.tsv", 1)
    for collection_info in collection_info_table:
        info = parse_collection_info(collection_info)
        ret.append(info)
    return ret

def parse_collection_info(collection_info):
    _collection = collection_info
    name  = _collection[0]
    length = int(_collection[1])
    itemInfos = _collection[2:2+length]
    return {
        'name': name,
        'itemInfos': itemInfos
    }

def read_collections():
    _collections = parse_collections()
    return _collections


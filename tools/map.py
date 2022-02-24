from enum_postech_in_the_sky import *
from parse.map import read_region

def print_region_and_cells(levels):
    for i, level in enumerate(levels):
        cellData = []
        data = read_region(level)
        print(f"const data{level} = {{")
        print("nodes: [")
        for cell in data['cells']:
            print(f'{{ id: "{cell["name"]}", x: {50*10*i + cell["x"] * 50}, y: {500 - cell["y"] * 50  + cell["x"] % 2 * 20 - 10}{""", color: "blue" """ if cell["isCapturable"] else ""}{""", color: "lightblue" """ if cell["isTeleportable"] else ""} }},')
            cellData.append(cell)

        print("""    ],
            links: [""")
        for cell in cellData:
            if 'adjEast' in cell:
                print(f'{{ source: "{cell["name"]}", target: "{cell["adjEast"]}" }},')
            if 'adjWest' in cell:
                print(f'{{ source: "{cell["name"]}", target: "{cell["adjWest"]}" }},')
            if 'adjSouth' in cell:
                print(f'{{ source: "{cell["name"]}", target: "{cell["adjSouth"]}" }},')
            if 'adjNorth' in cell:
                print(f'{{ source: "{cell["name"]}", target: "{cell["adjNorth"]}" }},')
        print("""    ],
            };
            """)

if __name__ == "__main__":
    print_region_and_cells([1,2,3,4,5])

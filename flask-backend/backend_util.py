from backend import *

def init_data():
    dark = ColorGroup(primary='dark',grayscale=True)
    dark.save()
    print('dark ID {}'.format(str(dark.id)))
    light = ColorGroup(primary='light',grayscale=True)
    light.save()
    print('light ID {}'.format(str(light.id)))
    black = Color(hexval='000000',rgb=['0','0','0'],colorgroup=dark)
    black.save()
    print('black ID {}'.format(str(black.id)))
    white = Color(hexval='FFFFFF',rgb=['255','255','255'],colorgroup=light)
    white.save()
    print('white ID {}'.format(str(white.id)))
    example = Site(domain='www.example1.com', sitegetter={'src':'style.css','options':['']}, colors=[white,black])
    example.save()
    print('example site ID {}'.format(str(example.id)))

    return dark, light, black, white, example

def delete_data(documents):

    for item in documents:
        item.delete()

def color_import():

    with open('colors.json') as f:
        colors = json.loads(f.read())
    
    for color_in in colors:
        pass
        # Search for color group
        # If color group DNE, create with name
        # Include logic to assess whether the color is light, dark, greyscale
        # Create color and (optionally) assign to color group
        
        # 
        r = color_in['rgb']['r']
        g = color_in['rgb']['g']
        b = color_in['rgb']['b']
        rgb = [r,g,b]

        color_group = ColorGroup(primary=color_in['name'])
        if abs(r-g)<10 and abs(r-b)<10 and abs(g-b)<10:
            color_group.grayscale = True
        else:
            color_group.grayscale = False
        color_group.save()

        # color_group = ColorGroup()
        color = Color(hexval=color_in['hexString'][1:7],
                      rgb=rgb,
                      colorgroup=color_group)
        color.save()

if __name__ == "__main__":
    print('Run with -i to interact with this. "python -i backend_util.py"')
    pass
def define_env(env):
    
    @env.macro
    def ctrlaltdel(unit_price, no):
        return "++ctrl+alt+delete++"


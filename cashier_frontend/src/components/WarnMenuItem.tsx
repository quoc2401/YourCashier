import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { InputSwitch } from 'primereact/inputswitch';
import { useEffect, useState } from "react";
import { API_USER } from "@/services/axiosClient";
import { useStore } from "@/services/stores";
import { WARN_LEVELS } from "@/utils/constant";
import { classNames } from "primereact/utils";


const WarnMenuItem = (item:MenuItem, options: MenuItemOptions) => {
    const currentUser = useStore(state => state.currentUser)
    const [toggled, setToggled] = useState(false)
    const [level, setLevel] = useState(0)

    useEffect(() => {
        getWarning()
    }, [])

    useEffect(() => {
        updateWarning()
    }, [level])

    const updateWarning = async () => {
        const res = await API_USER.API_USER.apiToggleWarning(currentUser?.id, WARN_LEVELS[level])
    }

    const getWarning = async () => { 
        try {
            const res = await API_USER.API_USER.apiGetWarning(currentUser?.id)

            const levelKey = Object.keys(WARN_LEVELS).find(k => WARN_LEVELS[k] == res.data.warnLevel)
            if (levelKey) {
                const warnLevel = parseInt(levelKey)
                setLevel(warnLevel)

                if(warnLevel % 2 > 0)
                    setToggled(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleToggle = () => {
        setToggled(t => {
            const _t = !t
            if (_t)
                setLevel(l => l % 2 + 1)
            else 
                setLevel(0)

            return _t
        })
    }
   
    return (
        <a className={options.className} target={item.target} onClick={() => handleToggle()}>
            <span className={classNames(options.iconClassName, item.icon)}></span>
            <span className={options.labelClassName}>{item.label}</span>
            <InputSwitch checked={toggled} />
        </a>
    )
  };
  
  export default WarnMenuItem;
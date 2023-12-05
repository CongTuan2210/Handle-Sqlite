import React, { createContext, useContext, useState, useEffect} from 'react'
import {openDatabase} from 'react-native-sqlite-storage';

const AuthContext = createContext()
let db = openDatabase({name: 'Settings.db'})

const AuthProvider = ({children}) => {

    const [isDarkMode, setIsDarkMode] = useState(false)
    const [fontSize, setFontSize] = useState(16)
    const [titleSize, setTitleSize] = useState(18)
    const [textHeader, setTextHeader] =useState(24)
    const [iconSize, setIconSize] = useState(30)

    const handleSliderChange = value => {
        setFontSize(value)
        setTitleSize(value + 2)
        setTextHeader(value + 8)
        setIconSize(value + 14)

        db.transaction(txn => {
            txn.executeSql(
                'UPDATE table_setting SET font_size = ?, title_size = ?, text_header = ?, icon_size = ? WHERE id = 1',
                [value, value + 2, value + 8, value + 14],
                (tx, results) => {
                     if (results.rowsAffected > 0) {
                        console.log('Update Successfully!');
                    }
                },
                error => {
                    console.log(error)
                }
            );
        });
    };
    const toggleSwitch = () => {

        setIsDarkMode(previousState => !previousState);

        db.transaction(txn => {
            txn.executeSql(
                'UPDATE table_setting SET dark_mode = ? WHERE id = 1',
                [isDarkMode ? 0 : 1], 
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        console.log('Update Successfully!')
                    }
                },
                error => {
                    console.log(error)
                }
            );
        });
    }

    useEffect(() => {
        db.transaction(txn => {
            txn.executeSql(
                'SELECT * FROM table_setting WHERE id = 1',
                [],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        const row = results.rows.item(0);
                        setIsDarkMode(row.dark_mode === 1 );
                        setFontSize(row.font_size);
                        setTitleSize(row.title_size);
                        setTextHeader(row.text_header);
                        setIconSize(row.icon_size);
                    } else {
                        txn.executeSql(
                            'INSERT INTO table_setting (dark_mode, font_size, title_size, text_header, icon_size) VALUES (?, ?, ?, ?, ?)',
                        [
                            isDarkMode ? 1 : 0,
                            fontSize,
                            titleSize,
                            textHeader,
                            iconSize,
                        ],
                        (tx, results) => {
                            if (results.rowsAffected > 0) {
                                console.log('Add propertis successfully!');
                            }
                        },
                        error => {
                            console.log(error);
                        },
                    );
                 }
                },
            );
        });
    },[])

    return (
      <AuthContext.Provider
        value={{
            isDarkMode,
            fontSize,
            toggleSwitch,
            handleSliderChange,
            titleSize,
            textHeader,
            iconSize,
        }}>
        {children}
      </AuthContext.Provider>
    );
}

const useAuth = () => {
    return useContext(AuthContext)
}

export { AuthProvider, useAuth }

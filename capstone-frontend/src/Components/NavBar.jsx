
import "./NavBar.css";
import { useNavigate } from "react-router-dom";
import * as React from 'react';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Layer } from 'baseui/layer';
import { ChevronDown, Delete, Overflow, Upload, Blank } from 'baseui/icon';
import { StyledLink } from "baseui/link";
import {
    AppNavBar,
    setItemActive,
    mapItemsActive,
    NavItem,
} from 'baseui/app-nav-bar';

export default function NavBar({ currentUser, setCurrentUser }) {
    const [css] = useStyletron();
    const navigate = useNavigate();

    const [mainItems, setMainItems] = React.useState([
        { icon: Upload, label: 'Maps' },
        { icon: Upload, label: 'Primary B' },
        {
            icon: ChevronDown,
            label: 'Primary C',
            navExitIcon: Delete,
            children: [
                { icon: Upload, label: 'Secondary A' },
                { icon: Upload, label: 'Secondary B' },
                { icon: Upload, label: 'Secondary C' },
                { icon: Upload, label: 'Secondary D' },
            ],
        },
        {
            icon: ChevronDown,
            label: 'Primary D',
            navExitIcon: Delete,
            children: [
                {
                    icon: ChevronDown,
                    label: 'Secondary E',
                    children: [
                        { icon: Upload, label: 'Tertiary A' },
                        { icon: Upload, label: 'Tertiary B' },
                    ],
                },
                { icon: Upload, label: 'Secondary F' },
            ],
        },
    ]);

    const [userItems, setUserItems] = React.useState([
        { icon: Blank, label: 'User' },
        { icon: Overflow, label: 'Account item2' },
        { icon: Overflow, label: 'Account item3' },
        { icon: Overflow, label: 'Account item4' },
    ]);

    const [isNavVisible, setIsNavVisible] = React.useState(true);

    function handleMainItemSelect(item) {
        setMainItems((prev) => setItemActive(prev, item));
        if (item.label === "Maps")
            navigate('/maps');
    }

    function handleUserItemSelect(item) {
        setUserItems((prev) => setItemActive(prev, item));
        setMainItems((prev) => setItemActive(prev, item));
        navigate('/loggedInPage');
    }
    return (
        <div className="navbar__updated">
            <React.Fragment>
                {isNavVisible && (
                    <Layer>
                        <div
                            className={css({
                                boxSizing: 'border-box',
                                width: '100vw',
                                position: 'fixed',
                                top: '0',
                                left: '0',
                            })}
                        >
                            <AppNavBar
                                title="Capstone"
                                mainItems={mainItems}
                                userItems={userItems}
                                onMainItemSelect={handleMainItemSelect}
                                onUserItemSelect={(item) => handleUserItemSelect(item)}
                                username={currentUser ? currentUser.displayName : "User"}
                                usernameSubtitle="Pursuit Fellow"
                                userImgUrl={currentUser ? currentUser.photoURL : ""}
                            />
                        </div>
                    </Layer>
                )}
            </React.Fragment>
        </div>
    );
};

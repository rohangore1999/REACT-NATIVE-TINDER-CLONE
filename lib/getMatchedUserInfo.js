const getMatchUserInfo = (users, userLoggedIn) => {
    const newUsers = { ...users } // newusers gets a copy of old user
    delete newUsers[userLoggedIn] // now delete the user with the one who loggedIn

    // now flatterned the object to >>>  [id, {}]
    const [id, user] = Object.entries(newUsers).flat();

    // Object.entries(newUsers) will give us Key, Value pair and then with the help of .flat it will flatterned into simple array



    return { id, ...user } // it will give you the id with simple array(all details from user [...user])
}

export default getMatchUserInfo
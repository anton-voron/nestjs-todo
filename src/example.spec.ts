describe('my-test', () => {
  it('returns true', () => {
    expect(true).toEqual(true);
  });
});

class FriendsList {
  firends = [];

  public addFriend(name) {
    this.firends.push(name);
    this.announceFriend(name);
  }

  public announceFriend(name) {
    global.console.log(`${name} was added to the list`);
  }
}

describe('FriendsList', () => {
  it('initializes friends list', () => {
    const firendsList = new FriendsList();
    expect(firendsList.firends.length).toEqual(0);
  });

  it('adds friend to list', () => {
    const friendsList = new FriendsList();
    friendsList.addFriend('Mark');
    expect(friendsList.firends?.[0]).toEqual('Mark');
  });

  it('mock announceFriend', () => {
    const friendsList = new FriendsList();
    friendsList.announceFriend = jest.fn();
    expect(friendsList.announceFriend).not.toHaveBeenCalled();

    friendsList.addFriend('Mark');
    expect(friendsList.announceFriend).toHaveBeenCalled();
  });
});

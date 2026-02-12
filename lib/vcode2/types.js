export const TagAction = {
    open: "OPEN",
    close: "CLOSE"
};

export const TagType = {
    single: "SINGLE",
    range: "RANGE"
};

export class TagSymbol {
    constructor(index, position, length, name, action, properties, type) {
        this.index = index;
        this.position = position;
        this.length = length;
        this.name = name;
        this.action = action;
        this.properties = properties;
        this.type = type;
    }
}

export class Node {
    constructor(name, properties, children) {
        this.name = name;
        this.properties = properties;
        this.children = children;
    }
}

function HumanReadableError(text, details, parent){
    this.text = text;
    this.details = details;
    this.parent = parent;
};

module.exports = HumanReadableError;

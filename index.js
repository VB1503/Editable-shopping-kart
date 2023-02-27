const classNames = {
    DELETE: "delete" };
  
  const logger = {
    logging: false,
    log(msg) {
      if (this.logging) console.log(msg);
    } };
  
  const itemProto = {
    bought: false,
    toggle() {
      this.bought = !this.bought;
      this.trigger("toggled", this);
    } };
  
  const items = {
    list: [],
  
    add(item) {
      let newItem = Object.create(itemProto);
      Object.assign(newItem, item, Backbone.Events);
      newItem.on("toggled", function (item) {
        logger.log("toggled");
        view.addToList(item);
      });
      newItem.id = _.uniqueId();
      this.list.push(newItem);
      this.trigger("itemAdded", newItem);
      this.trigger("updated");
    },
  
    delete(id) {
      logger.log("delete: " + id);
      let item = _.find(items.list, {
        "id": id });
  
      view.remove(item.$el);
  
      this.list = _.pull(this.list, item);
      this.trigger("updated");
    },
  
    toggle(id) {
      _.find(items.list, {
        "id": id }).
      toggle();
  
      this.trigger("updated");
    } };
  
  const app = {
    init() {
      view.init();
      Object.assign(items, Backbone.Events);
      items.on("itemAdded", function (item) {
        logger.log("item added");
        view.addToList(item);
      });
  
      items.on("updated", function () {
        logger.log("updated");
        view.updateQuantities();
      });
    } };
  
  const view = {
    init() {
  
      this.$shoppingList = $("#shopping-list");
      this.$boughtList = $("#bought-list");
      this.$form = $("form");
  
      const handleSubmit = function (e) {
        e.preventDefault();
  
        let name = $("#item-input"),
        quantity = $("#quantity-input");
  
        if (name.val()) {
          items.add({
            name: name.val(),
            quantity: quantity.val() || 1 });
  
        }
        name.val("");
        quantity.val("");
  
      };
  
      const handleClick = function (e) {
        e.preventDefault();
        logger.log("Clicked");
  
        if (e.target.nodeName === "LI") {
          let id = $(e.target).data("id").toString();
          items.toggle(id);
        } else if (e.target.className === classNames.DELETE) {
          let id = $(e.target).parent().data("id").toString();
          items.delete(id);
        }
      };
  
      const handleDelete = function (e) {
        e.preventDefault();
        logger.log("Delete: " + item);
        let id = $(e.target).data("id").toString(),
        item = _.find(items.list, {
          "id": id });
  
      };
  
      $("#lists").on("click", handleClick);
      this.$form.on("submit", handleSubmit);
      $("." + classNames.DELETE).on("click", handleDelete);
  
    },
  
    addToList(item, list) {
      let $item = item.$el || this.createListItem(item);
  
      if (item.bought) {
        $item.prependTo(this.$boughtList);
      } else {
        $item.appendTo(this.$shoppingList);
      }
    },
  
    updateQuantities() {
      logger.log("updateQuantities");
      $("#shopping-num").html(this.$shoppingList.children().length);
      $("#bought-num").html(this.$boughtList.children().length);
    },
  
    remove($el) {
      $el.remove();
    },
  
    createListItem(item) {
      item.$el = $(`<li data-id=${item.id}>${item.name} <span class="quantity">${item.quantity}</span><span class="delete">X</span></li>`);
  
      return item.$el;
    },
  
    getListItem(id) {
      let $el = $("li[data-id='" + id + "']");
      return $el.length ? $el : null;
    },
  
    render(items) {
      logger.log("render");
  
      this.$shoppingList.empty();
      this.$boughtList.empty();
  
      items.forEach(item => {
        let $item = $(`<li data-id=${item.id}>${item.name}<span>${item.quantity}</span></li>`);
  
        if (item.bought) {
          this.$boughtList.append($item);
          $item.addClass("bought");
        } else {
          this.$shoppingList.append($item);
        }
      });
  
    } };
  
  app.init();
  
 

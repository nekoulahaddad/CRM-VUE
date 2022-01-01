<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/clients_title.svg" alt="" />
      </div>
      <h1 class="page__title">Клиенты</h1>
    </div>
    <div class="page__body d-flex">
      <div class="filter">
        <div class="filter__inner">
          <div class="filter__header">
            <div class="filter__title">Фильтр</div>
          </div>
          <div class="filter__body">
            <div class="filter__group group">
              <div class="group__title">Регионы:</div>
              <div class="group__content">
                <select class="form-select">
                  <option value="Все задачи">Все регионы</option>
                </select>
              </div>
            </div>
            <div class="filter__group group">
              <div class="group__title">Сортировка:</div>
              <div class="group__content">
                <select class="form-select">
                  <option value="Все задачи">Интернет-магазин</option>
                </select>
              </div>
            </div>
            <div class="filter__actions">
              <button class="btn btn--red filter__btn">Очистить</button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <table class="table">
          <thead>
            <tr>
              <td colspan="8">Клиенты</td>
            </tr>
            <tr>
              <td>№:</td>
              <td>Клиент</td>
              <td>Почта:</td>
              <td>Телефон:</td>
              <td>Регион:</td>
              <td>Дата:</td>
              <td>Сумма:</td>
              <td>Клубная карта:</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Аракелов С.В.</td>
              <td>info@gmail.com</td>
              <td>+7 415 000 00 00</td>
              <td>Москва и М.О</td>
              <td>13.12.2021</td>
              <td>7409.37 BYN</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Tasks from "./Tasks";
export default {
  components: { Tasks },
  data() {
    return {
      columns: [
        { label: "id", field: "id" },
        {
          label: "Username",
          field: "user.username",
          headerClass: "class-in-header second-class",
        },
        { label: "First Name", field: "user.firstName" },
        { label: "Last Name", field: "user.lastName" },
        { label: "Email", field: "user.email" },
        {
          label: "Address",
          representedAs: ({ address, city, state }) =>
            `${address}<br />${city}, ${state}`,
          interpolate: true,
        },
      ],
      rows: [
        {
          id: 1,
          user: {
            username: "dprice0",
            firstName: "Daniel",
            lastName: "Price",
            email: "dprice0@blogs.com",
          },
          address: "3 Toban Park",
          city: "Pocatello",
          state: "Idaho",
        },
        {
          id: 2,
          user: {
            username: "dprice0",
            firstName: "Daniel",
            lastName: "Price",
            email: "dprice0@blogs.com",
          },
          address: "3 Toban Park",
          city: "Pocatello",
          state: "Idaho",
        },
      ],
    };
  },
};
</script>

<template>
  <div class="table-add-document">
    <div class="table-inner">
      <div class="table-inner__title">Добавить документ</div>
      <div class="table-inner__description description">
        <div class="description__title">Описание</div>
        <div class="description__content"></div>
      </div>
      <div class="table-inner__table">
        <table class="table">
          <tr class="shadow">
            <td>Тест</td>
            <td>
              <div class="table__actions">
                <div class="table__icon">
                  <img src="/icons/file_icon.svg" alt="" />
                </div>
                <div class="table__icon">
                  <img src="/icons/trash_icon.svg" alt="" />
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="table-inner__actions">
        <v-button red>Сохранить</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  components: { VButton },
};
</script>

<template>
  <div v-click-outside>
    <input type="text" :value="formatDate" />
    <div class="pannel" v-show="isShow">
      <div class="pannel-nav">
        <span @click="prevYear">&lt;</span>
        <span @click="prevMonth">&lt;&lt;</span>
        <span>{{time.year}}年</span>-
        <span>{{time.month + 1}}月</span>
        <span @click="nextMonth">&gt;&gt;</span>
        <span @click="nextYear">&gt;</span>
      </div>
      <div class="pannel-content">
        <!-- 直接列出一个 6*7 的列表 -->
        <div class="days">
          <span v-for="k in 7" :key="'-'+k" class="weekday">{{weekDays[k-1]}}</span>
          <div v-for="i in 6" :key="i">
            <!-- 判断当前日期是不是当月的，不是则日期数字为黑 -->
            <span
              v-for="j in 7"
              :key="j"
              @click="chooseDay(showDays[(i-1)*7 + (j-1)])"
              class="cell"
              :class="[{notCurrentMonth: isCurrentMonth(showDays[(i-1)*7 + (j-1)])},
                      {today: isToday(showDays[(i-1)*7 + (j-1)])},
                      {select: isSelect(showDays[(i-1)*7 + (j-1)])}]"
            >{{showDays[(i-1)*7 + (j-1)].getDate()}}</span>
          </div>
        </div>
      </div>
      <div class="pannel-footer" @click="toDay()">今天</div>
    </div>
  </div>
</template>

<script>
import { dateFormate, getDate } from "./util";
export default {
  data() {
    let { year, month } = dateFormate(this.value);
    return {
      weekDays: ["日", "一", "二", "三", "四", "五", "六"],
      time: {
        year,
        month
      },
      isShow: false // 控制日历面板是否可见
    };
  },
  directives: {
    clickOutside: {
      // 指令的生命周期
      bind(el, binding, vnode) {
        // 把事件绑定给document上，如果点击的是date组件，则日历显示，否则日历隐藏
        let handler = e => {
          if (el.contains(e.target)) {
            // 判断当前日历是否已经显示，防止反复执行
            if (!vnode.context.isShow) {
              vnode.context.focus();
            }
          } else {
            if (vnode.context.isShow) {
              vnode.context.blur();
            }
          }
        };
        el.handler = handler;
        document.addEventListener("click", handler);
      },
      // 解绑
      unbind(el) {
        document.removeEventListener(el.handler);
      }
    }
  },
  methods: {
    focus() {
      this.isShow = true;
    },
    blur() {
      this.isShow = false;
    },
    // 是否是当月
    isCurrentMonth(date) {
      let { year, month } = dateFormate(new Date(this.time.year, this.time.month, 1));
      let { year: y, month: m } = dateFormate(date);

      return !(year === y && month === m);
    },
    // 是否是当天
    isToday(date) {
      let { year, month, day } = dateFormate(new Date());
      let { year: y, month: m, day: d } = dateFormate(date);

      return year === y && month === m && day === d;
    },
    // 选择日期的方法
    chooseDay(date) {
      this.time = dateFormate(date);
      this.$emit("input", date);
    },
    // 是否是当前选中的日期
    isSelect(date) {
      let { year, month, day } = dateFormate(this.value);
      let { year: y, month: m, day: d } = dateFormate(date);

      return year === y && month === m && day === d;
    },
    // 上一月和下一月
    prevMonth() {
      // 获取当前的年月的日期，然后更新到data中的time
      let d = new Date(this.time.year, this.time.month)
      d.setMonth(d.getMonth() - 1)
      this.time = dateFormate(d)
    },
    nextMonth() {
      let d = new Date(this.time.year, this.time.month)
      d.setMonth(d.getMonth() + 1)
      this.time = dateFormate(d)
    },
    // 上一年和下一年
    prevYear() {
      // 获取当前的年月的日期，然后更新到data中的time
      let d = new Date(this.time.year, this.time.month)
      d.setYear(d.getFullYear() - 1)
      console.log(d.getFullYear())
      this.time = dateFormate(d)
    },
    nextYear() {
      let d = new Date(this.time.year, this.time.month)
      d.setYear(d.getFullYear() + 1)
      this.time = dateFormate(d)
    },
    // 返回到今天
    toDay() {
      this.time = dateFormate(new Date())
    }
  },
  props: {
    value: {
      type: Date,
      default: () => new Date() // 当默认值是一个对象类型是，必须通过函数的形式返回
    }
  },
  computed: {
    showDays() {
      // 先将当前的日期变为该月的第一天 2020-5-12--> 2020-5-1
      // 获取1号是周几,将天数往前移几天，然后循环该月日历上显示的天数 42天
      let { year, month } = dateFormate(new Date(this.time.year, this.time.month, 1));
      let currentFirstDay = getDate(year, month, 1);
      let week = currentFirstDay.getDay();
      // 当前开始的天数
      let startDay = currentFirstDay - week * 1000 * 3600 * 24;
      // 循环42天
      let arr = [];
      for (let i = 0; i < 42; i++) {
        arr.push(new Date(startDay + i * 1000 * 3600 * 24));
      }
      return arr;
    },
    formatDate() {
      let { year, month, day } = dateFormate(this.value);
      return `${year}-${month + 1}-${day}`;
    }
  }
};
</script>

<style lang="less">
* {
  box-sizing: border-box;
}
.pannel {
  position: absolute;
  margin-top: 5px;
  background-color: #fff;
  width: 45px * 7;
  box-shadow: 2px 2px 2px #999, -2px -2px 2px #999;
  .pannel-nav {
    display: flex;
    justify-content: space-around;
    height: 30px;
    line-height: 30px;
    span {
      cursor: pointer;
      user-select: none;
      font-weight: bold;
    }
  }
  .pannel-content {
    .cell,
    .weekday {
      display: inline-block;
      width: 45px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      user-select: none;
      font-weight: bold;
      border: 1px solid transparent;
      border-radius: 4px;
      &:hover {
        border: 1px solid pink;
        box-sizing: border-box;
      }
    }
    .select {
      border: 1px solid pink;
    }
    .notCurrentMonth {
      color: #ccc;
    }
    .today {
      background-color: red;
      color: #eee;
      border-radius: 4px;
    }
  }
  .pannel-footer {
    line-height: 30px;
  }
}
</style>
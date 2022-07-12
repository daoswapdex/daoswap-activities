<template>
  <div class="fill-height">
    <v-container v-if="web3 && connected" class="fill-height">
      <v-row justify="center">
        <v-col md="6">
          <v-card class="fill-width">
            <v-card-title>
              <v-avatar size="24" class="mr-2">
                <img :src="require('@/assets/logo.png')" alt="list" />
              </v-avatar>
              <span class="title font-weight-light text-body-2">
                {{
                  $t(
                    "Aurora Anniversary Celebration & Meta Universe First Industry Summit"
                  )
                }}-{{ $t("Membership Pass") }}
              </span>
              <!-- <v-list two-line>
                <v-list-item>
                  <v-list-item-avatar class="mt-0 mb-0">
                    <v-avatar size="40" class="mr-2">
                      <img :src="require('@/assets/logo.png')" alt="list" />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content class="pt-0 pb-0">
                    <v-list-item-title class="text-h5" style="color: #93B954">
                      {{ $t("Membership Pass") }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-body-1">
                      {{
                        $t(
                          "Aurora Anniversary Celebration & Meta Universe First Industry Summit"
                        )
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list> -->
            </v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-card-text
              v-if="
                contractInfo.token &&
                  contractInfo.isOpen &&
                  accountAssets.ableExchange
              "
            >
              <v-container class="grey lighten-5">
                <v-row no-gutters class="align-center">
                  <v-col cols="4">
                    <v-card class="pa-2 exchange-info" outlined tile>
                      <div class="text-body-2">
                        {{ contractInfo.exchangeInTokenAmount }}
                        {{ exchangeInToken.symbol }}
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-card class="pa-2 exchange-info" outlined tile>
                      <v-icon class="text-h2">
                        mdi-swap-horizontal
                      </v-icon>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-card class="pa-2 exchange-info" outlined tile>
                      <div class="text-body-2">
                        {{ contractInfo.exchangeOutTokenAmount }}
                        {{ exchangeOutToken.symbol }}
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
              <v-card-actions class="justify-center">
                <v-btn
                  color="#93B954"
                  dark
                  width="80%"
                  @click="
                    accountAssets.allowanceAmount &&
                    parseFloat(accountAssets.allowanceAmount) >=
                      parseFloat(contractInfo.exchangeInTokenAmount)
                      ? exchange()
                      : handleApprove()
                  "
                >
                  {{
                    accountAssets.allowanceAmount &&
                    parseFloat(accountAssets.allowanceAmount) >=
                      parseFloat(contractInfo.exchangeInTokenAmount)
                      ? $t("Exchange")
                      : $t("Approve")
                  }}
                </v-btn>
              </v-card-actions>
            </v-card-text>
            <v-card-text v-else>
              <v-row>
                <v-col cols="12">
                  <div
                    class="text-h5"
                    v-if="!contractInfo.isOpen && !accountAssets.haveTicket"
                  >
                    {{ $t("Activity is not in progress") }}
                  </div>
                  <div class="text-h5" style="color: #93B954;" v-else>
                    {{ $t("You already have a ticket") }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <v-row align="center">
                <v-col
                  class="body-1"
                  cols="12"
                  @click="
                    handleCopy(contractInfo.exchangeOutTokenAddress, $event)
                  "
                >
                  <p>
                    {{ $t("Token Adress") }}:
                    {{ contractInfo.exchangeOutTokenAddress }}
                    <v-icon>mdi-content-copy</v-icon>
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <!-- 当前钱包账号 -->
          <v-card justify="center" class="fill-width mt-10">
            <v-card-title>
              <span class="title font-weight-light">
                {{ $t("Current Token Address") }}
              </span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row align="center">
                <v-col
                  class="body-1"
                  cols="12"
                  @click="handleCopy(address, $event)"
                >
                  <p>
                    {{ address }}
                    <v-icon>mdi-content-copy</v-icon>
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <!-- 遮罩层 -->
          <v-overlay z-index="9999" opacity="0.7" :value="loading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
          <!-- 提示层 -->
          <v-snackbar
            v-model="operationResult.snackbar"
            :color="operationResult.color"
            centered
            top
            timeout="4000"
          >
            {{ $t(operationResult.text) }}
          </v-snackbar>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else>
      <v-row justify="center">
        <v-col md="6">
          <v-card justify="center" class="fill-width">
            <v-card-actions class="justify-center">
              <!-- 连接钱包 -->
              <v-btn
                class="mr-2"
                v-if="!connected"
                color="#93B954"
                block
                @click="onConnect"
              >
                {{ $t("Connect Wallet") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import clip from "@/utils/clipboard";
import { ExchangeTicketContractAddress } from "@/constants/index";
import { getContractByABI, weiToEther, etherToWei } from "@/utils/web3";
// 引入合约 ABI 文件
import ActivityCoin_ABI from "@/constants/contractJson/ActivityCoin_abi.json";
import ExchangeTicket_ABI from "@/constants/contractJson/ExchangeTicket_abi.json";

export default {
  name: "AllocationFee",
  data: () => ({
    loading: false,
    // 当前账户相关信息
    accountAssets: {
      balance: 0,
      allowanceAmount: 0,
      ableExchange: true,
      haveTicket: false
    },
    contractInfo: {
      token: null,
      exchangeOutTokenAddress: null,
      exchangeOutTokenAmount: null,
      exchangeInTokenAddress: null,
      exchangeInTokenAmount: null,
      isOpen: null
    },
    // 代币信息
    exchangeOutToken: {
      name: null,
      symbol: null
    },
    exchangeInToken: {
      name: null,
      symbol: null
    },
    // 提示框
    operationResult: {
      color: "success",
      snackbar: false,
      text: `Hello`
    }
  }),
  created() {
    if (this.web3 && this.connected) {
      this.getInfo();
    } else {
      this.onConnect();
    }
  },
  watch: {
    web3(web3) {
      if (web3) {
        this.getInfo();
      }
    },
    address(address) {
      if (address) {
        this.getInfo();
      }
    },
    chainId(chainId) {
      if (chainId) {
        this.getInfo();
      }
    }
  },
  computed: {
    connected() {
      return this.$store.state.web3.connected;
    },
    web3() {
      return this.$store.state.web3.web3;
    },
    address() {
      return this.$store.state.web3.address;
    },
    chainId() {
      return this.$store.state.web3.chainId;
    }
  },
  methods: {
    // 连接钱包 OK
    onConnect() {
      this.$store.dispatch("web3/connect");
    },
    // 断开连接钱包 OK
    closeWallet() {
      this.$store.dispatch("web3/closeWallet");
    },
    // 复制地址
    handleCopy(text, event) {
      clip(text, event);
      this.operationResult.color = "success";
      this.operationResult.snackbar = true;
      this.operationResult.text = "Cope Success";
    },
    // 获取信息
    async getInfo() {
      this.getContractInfoToken();
      await this.getContractInfo();
      await this.getAccountAssets();
      await this.getTokenInfo();
    },
    // 获取合约地址
    getContractInfoToken() {
      const contractInfoToken = ExchangeTicketContractAddress.filter(
        info => info.chainId === parseInt(this.chainId)
      )[0];
      if (contractInfoToken) {
        this.contractInfo.token = contractInfoToken.address;
      }
    },
    // 获取合约信息
    async getContractInfo() {
      this.loading = true;
      if (this.contractInfo.token) {
        try {
          // 查询兑换合约信息
          const contract = await getContractByABI(
            ExchangeTicket_ABI,
            this.contractInfo.token,
            this.web3
          );
          this.contractInfo.exchangeOutTokenAddress = await contract.methods
            .exchangeOutTokenAddress()
            .call({ from: this.address });
          const exchangeOutTokenAmount = await contract.methods
            .exchangeOutTokenAmount()
            .call({ from: this.address });
          this.contractInfo.exchangeOutTokenAmount = weiToEther(
            exchangeOutTokenAmount,
            this.web3
          );
          this.contractInfo.exchangeInTokenAddress = await contract.methods
            .exchangeInTokenAddress()
            .call({ from: this.address });
          const exchangeInTokenAmount = await contract.methods
            .exchangeInTokenAmount()
            .call({ from: this.address });
          this.contractInfo.exchangeInTokenAmount = weiToEther(
            exchangeInTokenAmount,
            this.web3
          );
          this.contractInfo.isOpen = await contract.methods
            .isOpen()
            .call({ from: this.address });
          this.accountAssets.ableExchange = await contract.methods
            .ableExchange()
            .call({ from: this.address });
          this.accountAssets.haveTicket = await contract.methods
            .haveTicket()
            .call({ from: this.address });
        } catch (error) {
          console.info(error);
        }
      }
      this.loading = false;
    },
    // 获取账号信息
    async getAccountAssets() {
      this.loading = true;
      if (this.contractInfo.token && this.contractInfo.exchangeInTokenAddress) {
        try {
          // 查询当前账号余额
          const contractActivityCoin = getContractByABI(
            ActivityCoin_ABI,
            this.contractInfo.exchangeInTokenAddress,
            this.web3
          );
          const balance = await contractActivityCoin.methods
            .balanceOf(this.address)
            .call();
          const allowance = await contractActivityCoin.methods
            .allowance(this.address, this.contractInfo.token)
            .call();
          this.accountAssets.balance = weiToEther(balance, this.web3);
          this.accountAssets.allowanceAmount = weiToEther(allowance, this.web3);
        } catch (error) {
          console.info(error);
        }
      }
      this.loading = false;
    },
    // 获取代币信息
    async getTokenInfo() {
      this.loading = true;
      if (
        this.contractInfo.exchangeOutTokenAddress &&
        this.contractInfo.exchangeInTokenAddress
      ) {
        try {
          const contractActivityCoinOut = getContractByABI(
            ActivityCoin_ABI,
            this.contractInfo.exchangeOutTokenAddress,
            this.web3
          );
          this.exchangeOutToken.name = await contractActivityCoinOut.methods
            .name()
            .call();
          this.exchangeOutToken.symbol = await contractActivityCoinOut.methods
            .symbol()
            .call();
          const contractActivityCoinIn = getContractByABI(
            ActivityCoin_ABI,
            this.contractInfo.exchangeInTokenAddress,
            this.web3
          );
          this.exchangeInToken.name = await contractActivityCoinIn.methods
            .name()
            .call();
          this.exchangeInToken.symbol = await contractActivityCoinIn.methods
            .symbol()
            .call();
        } catch (error) {
          console.info(error);
        }
      }
      this.loading = false;
    },
    // 授权
    handleApprove() {
      this.loading = true;
      // 执行合约
      getContractByABI(
        ActivityCoin_ABI,
        this.contractInfo.exchangeInTokenAddress,
        this.web3
      )
        .methods.approve(
          this.contractInfo.token,
          etherToWei(this.contractInfo.exchangeInTokenAmount, this.web3)
        )
        .send({ from: this.address })
        .then(() => {
          this.loading = false;
          this.operationResult.color = "success";
          this.operationResult.snackbar = true;
          this.operationResult.text = "Approve Success";
          this.getInfo();
        })
        .catch(e => {
          this.loading = false;
          console.info(e);
        });
    },
    // 兑换
    exchange() {
      if (!this.contractInfo.token) {
        this.operationResult.color = "error";
        this.operationResult.snackbar = true;
        this.operationResult.text =
          "Please select the token to be used for exchange";
      } else {
        this.loading = true;
        getContractByABI(ExchangeTicket_ABI, this.contractInfo.token, this.web3)
          .methods.exchange()
          .send({ from: this.address })
          .then(() => {
            this.loading = false;
            this.getInfo();
          })
          .catch(e => {
            this.loading = false;
            console.info(e);
          });
      }
    }
  }
};
</script>

<style lang="sass">
.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg
  background-color: rgb(147, 185, 84) !important
  border-color: rgb(147, 185, 84) !important
  opacity: 0.5 !important

.v-btn--disabled
  background-color: rgb(147, 185, 84)
  border-color: rgb(147, 185, 84)
  opacity: 0.5

.v-input--selection-controls
  margin-top: 0 !important
  padding-top: 0 !important

.exchange-info
  border: 0 !important
  outline: none !important
  text-align: center !important
</style>

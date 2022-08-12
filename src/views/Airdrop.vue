<template>
  <div class="fill-height">
    <v-container v-if="web3 && connected" class="fill-height">
      <v-row justify="center">
        <v-col md="6">
          <!-- 空投  -->
          <v-card class="fill-width">
            <v-card outlined>
              <!-- 标题 -->
              <v-card-title>
                <v-avatar size="24" class="mr-2">
                  <img :src="require('@/assets/logo.png')" alt="DAO" />
                </v-avatar>
                <span class="title font-weight-light text-body-2">
                  {{ $t("Get Rewards") }}
                </span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions
                class="justify-center"
                v-if="
                  contractAirdrop.token &&
                    contractAirdrop.hasRewardsInfo &&
                    contractAirdrop.isOpen &&
                    !contractAirdrop.isClaim
                "
              >
                <v-btn color="#93B954" dark width="80%" @click="getRewards()">
                  {{ $t("Get Rewards") }}
                </v-btn>
              </v-card-actions>
              <v-card-text v-else>
                <v-row>
                  <v-col cols="12">
                    <div
                      class="text-h5"
                      style="color: #93B954;"
                      v-if="
                        contractAirdrop.hasRewardsInfo &&
                          contractAirdrop.isClaim
                      "
                    >
                      {{ $t("Already received") }}
                    </div>
                    <div class="text-h5" v-else>
                      {{ $t("Activity is not in progress") }}
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
                    v-if="contractAirdrop.newToken"
                    @click="handleCopy(contractAirdrop.newToken, $event)"
                  >
                    <p>
                      {{ $t("Token Address") }}:
                      {{ contractAirdrop.newToken }}
                      <v-icon>mdi-content-copy</v-icon>
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
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
import { AirdropContractAddress } from "@/constants/index";
import { getContractByABI } from "@/utils/web3";
// 引入合约 ABI 文件
import Airdrop_ABI from "@/constants/contractJson/Airdrop_abi.json";

export default {
  name: "Airdrop",
  data: () => ({
    loading: false,
    contractAirdrop: {
      token: null,
      newToken: null,
      hasRewardsInfo: false,
      isOpen: false,
      isClaim: true
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
    },
    // 获取合约地址
    getContractInfoToken() {
      // airdrop
      const contractAirdropToken = AirdropContractAddress.filter(
        info => info.chainId === parseInt(this.chainId)
      )[0];
      if (contractAirdropToken) {
        this.contractAirdrop.token = contractAirdropToken.address;
      }
    },
    // 获取合约信息
    async getContractInfo() {
      this.loading = true;
      if (this.contractAirdrop.token) {
        try {
          // 查询空投合约信息
          const contractAirdrop = await getContractByABI(
            Airdrop_ABI,
            this.contractAirdrop.token,
            this.web3
          );
          this.contractAirdrop.newToken = await contractAirdrop.methods
            .token()
            .call({ from: this.address });
          this.contractAirdrop.hasRewardsInfo = await contractAirdrop.methods
            .hasRewardsInfo(this.address)
            .call({ from: this.address });
          this.contractAirdrop.isOpen = await contractAirdrop.methods
            .isOpen()
            .call({ from: this.address });
          const rewardsInfo = await contractAirdrop.methods
            .accountRewardsMap(this.address)
            .call();
          this.contractAirdrop.isClaim = rewardsInfo.isClaim;
        } catch (error) {
          console.info(error);
        }
      }
      this.loading = false;
    },
    // 提取DAO
    getRewards() {
      if (!this.contractAirdrop.token) {
        this.operationResult.color = "error";
        this.operationResult.snackbar = true;
        this.operationResult.text =
          "Please select the token to be used for exchange";
      } else {
        this.loading = true;
        // 执行合约
        getContractByABI(Airdrop_ABI, this.contractAirdrop.token, this.web3)
          .methods.claim()
          .send({ from: this.address })
          .then(() => {
            this.loading = false;
            this.operationResult.snackbar = true;
            this.operationResult.text = "Claim Success";
            // 重新获取数据
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

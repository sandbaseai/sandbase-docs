---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground（試験運用）
description: 自分の API キーで実際の SandBase Sandbox を試せます。作成、コマンド実行、一時停止と再開後のファイル確認、ライフサイクルイベントの確認ができます。
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

自分の API キーで Sandbox API を試せます。操作は **sandbox.sandbase.ai** に接続され、料金が発生する場合があります。

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## キーは自分で管理できます {#your-key-stays-under-your-control}

- **ページのメモリにのみ保持。** この Playground は、API キーや接続トークンをブラウザーのストレージや Cookie に保存したり、URL に含めたり、ページのアクティビティやリクエスト例に記録したりしません。
- **いつでも消去可能。** **キーを消去** を選択すると、リクエストの実行中でも、キー、接続トークン、表示中のアクティビティが削除されます。ページを再読み込みするか、このページから移動した場合も消去されます。再接続するにはキーを再度入力する必要があります。
- **自分のリクエストにのみ使用。** キーは、リクエストした Sandbox 操作を認証するためにのみ SandBase に送信されます。このページを消去してもキーは失効しません。必要に応じて [Developer → API Keys](https://www.sandbase.ai/console/keys) で失効させてください。

これらは、この Playground における認証情報の取り扱いに関するものです。Sandbox のアクティビティやサービス側の使用記録が消去されることを意味するものではありません。コマンドやファイルにシークレットを入力しないでください。その内容は Sandbox 内に残る可能性があります。

## リソースは別途クリーンアップする {#clean-up-resources-separately}

キーを消去しても、サービスがすでに受け付けた操作はキャンセルされず、Sandbox も削除されません。使い終わったらインスタンスを削除してください。作成結果が不明な場合は、新しく作成する前にインスタンスを確認してください。クリーンアップに必要なインスタンス ID は、このページを消去する前に控えておいてください。

[概要と機能](./index) · [クイックスタート / E2B SDK](./quickstart)

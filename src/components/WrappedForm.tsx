import React, { useState } from "react";
import { Form, Input, Icon, Button, message, Tooltip } from "antd";
import { ValueProps, ScoreProps } from "../types/index";
import "../styles/WrappedForm.sass";

const DynamicFieldSet = (props: { form: any }) => {
    const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;
    const [keys, setKeys] = useState(
        localStorage["Chimney_Key"]
            ? JSON.parse(localStorage["Chimney_Key"])
            : []
    ); // localStorage
    const [Score, setScore] = useState([] as ScoreProps[]);
    const [RankList, setRankList] = useState([] as ScoreProps[]);
    const [Editable, setEditable] = useState([] as boolean[]);
    const [label, setLabel] = useState(
        localStorage["Chimney_Label"]
            ? JSON.parse(localStorage["Chimney_Label"])
            : ([] as string[])
    );
    const [Config, setConfig] = useState(
        localStorage["Chimney_Config"]
            ? JSON.parse(localStorage["Chimney_Config"])
            : ({} as ValueProps)
    );

    // methods

    // 存 localStorage
    const save = (keys: string[], L?: string[]) => {
        props.form.validateFields((err: Error, values: ValueProps) => {
            if (!err) {
                localStorage["Chimney_Key"] = JSON.stringify(keys);
                localStorage["Chimney_Config"] = JSON.stringify(values);
            }
            localStorage["Chimney_Label"] = JSON.stringify(L || label);
        });
    };

    // 编辑title
    const handleEdit = (k: number) => {
        let arr = [...Editable];
        arr[k] = true;
        setEditable(arr);
    };
    // 修改title
    const EditTitle = async (idx: number) => {
        let modifiedTitle = getFieldValue("modifiedTitle");
        let labelArr = [...label];
        labelArr[idx] = modifiedTitle;
        setLabel(labelArr);
        let arr = [...Editable];
        arr = arr.map(() => false);
        setEditable(arr);
        save(keys, labelArr);
    };
    // 计算
    const caculate = (
        WA: number,
        WB: number,
        WC: number,
        WD: number,
        a: number,
        b: number,
        c: number,
        d: number
    ): number => {
        return (a * WA + b * WB + c * WC + d * WD) / 100;
    };
    // 删除行
    const remove = (idx: number) => {
        if (keys.length === 1) {
            return;
        }
        props.form.validateFields(async (err: Error, values: ValueProps) => {
            if (!err) {
                let { A, B, C, D } = values;
                let a = A.filter((e: number, id: number) => id !== idx);
                let b = B.filter((e: number, id: number) => id !== idx);
                let c = C.filter((e: number, id: number) => id !== idx);
                let d = D.filter((e: number, id: number) => id !== idx);
                await setFieldsValue({
                    A: a,
                    B: b,
                    C: c,
                    D: d
                });
                setConfig({
                    ...Config,
                    A: a,
                    B: b,
                    C: c,
                    D: d
                });
            }
            let arr = keys.slice(0, keys.length - 1);
            let labelArr = label.filter((e: number, id: number) => id !== idx);
            setKeys(arr);
            setLabel(labelArr);
            setScore(Score.slice(0, idx).concat(Score.slice(idx + 1)));
            save(arr, labelArr);
        });
    };
    // 新增行
    const add = () => {
        let arr = keys.concat(keys.length);
        let newLabel = label.concat(`卡片 ${keys.length + 1}`);
        setKeys(arr);
        setLabel(newLabel);
        save(arr, newLabel);
    };
    // 提交计算
    const handleSubmit = (e: Event) => {
        e.preventDefault();
        props.form.validateFields((err: Error, values: ValueProps) => {
            if (!err) {
                if (!keys.length) {
                    message.warning("请先添加卡片信息");
                    return;
                }
                const { WA, WB, WC, WD, A, B, C, D } = values;
                if (isNaN(+WA) || isNaN(+WB) || isNaN(+WC) || isNaN(+WD)) {
                    message.warning("检测到非法输入，请输入数字");
                }
                let arr: ScoreProps[] = [...Score];
                for (let i = 0; i < A.length; i++) {
                    arr[i] = {
                        title: label[i],
                        val: caculate(WA, WB, WC, WD, A[i], B[i], C[i], D[i])
                    };
                    setScore(arr);
                }
                let Arr = [...arr];
                Arr.sort((a: ScoreProps, b: ScoreProps) => {
                    if (a.val > b.val) return -1;
                    else return 1;
                });
                setRankList(Arr);
                save(keys);
            } else {
                message.error("请检查输入");
            }
        });
    };

    // component

    // 行对象
    const formItems = keys.map((k: number, index: number) => (
        <Form.Item className="card" required={false} key={k}>
            {/* 用户可自定义的卡片名称，默认 index */}
            <div className="label">
                {Editable[index] ? (
                    <Form.Item>
                        {getFieldDecorator("modifiedTitle", {
                            initialValue: label[index]
                        })(
                            <Input
                                autoFocus
                                onBlur={() => EditTitle(index)}
                            ></Input>
                        )}
                    </Form.Item>
                ) : (
                    <Tooltip title={label[index]} placement="left">
                        <p>
                            <Icon
                                type="edit"
                                className="edit-icon"
                                onClick={() => handleEdit(index)}
                            ></Icon>
                            {label[index]}
                        </p>
                    </Tooltip>
                )}
                ：
            </div>
            {/* A */}
            <Form.Item>
                {getFieldDecorator(`A[${index}]`, {
                    validateTrigger: ["onChange", "onBlur"],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "请输入属性A"
                        }
                    ],
                    initialValue: Config["A"] && Config["A"][index]
                })(
                    <Input
                        placeholder="属性 A"
                        spellCheck="false"
                        autoComplete="off"
                        allowClear
                        onBlur={() => save(keys)}
                    />
                )}
            </Form.Item>
            {/* B */}
            <Form.Item>
                {getFieldDecorator(`B[${index}]`, {
                    validateTrigger: ["onChange", "onBlur"],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "请输入属性B"
                        }
                    ],
                    initialValue: Config["B"] && Config["B"][index]
                })(
                    <Input
                        placeholder="属性 B"
                        spellCheck="false"
                        autoComplete="off"
                        allowClear
                        onBlur={() => save(keys)}
                    />
                )}
            </Form.Item>
            {/* C */}
            <Form.Item>
                {getFieldDecorator(`C[${index}]`, {
                    validateTrigger: ["onChange", "onBlur"],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "请输入属性C"
                        }
                    ],
                    initialValue: Config["C"] && Config["C"][index]
                })(
                    <Input
                        placeholder="属性 C"
                        spellCheck="false"
                        autoComplete="off"
                        allowClear
                        onBlur={() => save(keys)}
                    />
                )}
            </Form.Item>
            {/* D */}
            <Form.Item>
                {getFieldDecorator(`D[${index}]`, {
                    validateTrigger: ["onChange", "onBlur"],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "请输入属性D"
                        }
                    ],
                    initialValue: Config["D"] && Config["D"][index]
                })(
                    <Input
                        placeholder="属性 D"
                        spellCheck="false"
                        autoComplete="off"
                        allowClear
                        onBlur={() => save(keys)}
                    />
                )}
            </Form.Item>
            {/* 结果 */}
            <Form.Item
                style={{
                    position: "absolute",
                    transform: "translateX(600px)"
                }}
            >
                <span
                    style={{
                        color: "rgb(225,225,225)"
                    }}
                >
                    得分：{Score[index]?.val || 0}
                </span>
            </Form.Item>
            {/* 删除卡片按钮 */}
            {keys.length > 1 ? (
                <Icon
                    className="dynamic-delete-button"
                    style={{
                        color: "rgb(225,225,225)",
                        position: "absolute",
                        right: "-10px",
                        top: "20%"
                    }}
                    type="minus-circle-o"
                    onClick={() => remove(index)}
                />
            ) : null}
        </Form.Item>
    ));

    return (
        <Form>
            {/* 关卡配置 */}
            <Form.Item className="card">
                {/* label */}
                <p className="label">关卡配置(权重/%)：</p>
                {/* 权重A */}
                <Form.Item>
                    {getFieldDecorator(`WA`, {
                        validateTrigger: ["onChange", "onBlur"],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "请输入A的权重"
                            }
                        ],
                        initialValue: Config["WA"]
                    })(
                        <Input
                            placeholder="属性 A"
                            spellCheck="false"
                            autoComplete="off"
                            allowClear
                            onBlur={() => save(keys)}
                        />
                    )}
                </Form.Item>
                {/* 权重B */}
                <Form.Item>
                    {getFieldDecorator(`WB`, {
                        validateTrigger: ["onChange", "onBlur"],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "请输入B的权重"
                            }
                        ],
                        initialValue: Config["WB"]
                    })(
                        <Input
                            placeholder="属性 B"
                            spellCheck="false"
                            autoComplete="off"
                            allowClear
                            onBlur={() => save(keys)}
                        />
                    )}
                </Form.Item>
                {/* 权重C */}
                <Form.Item>
                    {getFieldDecorator(`WC`, {
                        validateTrigger: ["onChange", "onBlur"],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "请输入C的权重"
                            }
                        ],
                        initialValue: Config["WC"]
                    })(
                        <Input
                            placeholder="属性 C"
                            spellCheck="false"
                            autoComplete="off"
                            allowClear
                            onBlur={() => save(keys)}
                        />
                    )}
                </Form.Item>
                {/* 权重D */}
                <Form.Item>
                    {getFieldDecorator(`WD`, {
                        validateTrigger: ["onChange", "onBlur"],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "请输入D的权重"
                            }
                        ],
                        initialValue: Config["WD"]
                    })(
                        <Input
                            placeholder="属性 D"
                            spellCheck="false"
                            autoComplete="off"
                            allowClear
                            onBlur={() => save(keys)}
                        />
                    )}
                </Form.Item>
            </Form.Item>
            {/* 卡片信息 */}
            {formItems}
            {/* 新增按钮 */}
            <Form.Item>
                <Button type="dashed" onClick={add} style={{ width: "100%" }}>
                    <Icon type="plus" /> <span>新增卡片</span>
                </Button>
            </Form.Item>
            {/* 提交按钮 */}
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={(e: any) => handleSubmit(e)}
                >
                    开始计算
                </Button>
            </Form.Item>
            {/* 最佳卡片 */}
            {RankList.length ? (
                <div className="higher">
                    {RankList.slice(0,3).map((e: ScoreProps, idx: number) => (
                        <p key={idx}>
                            {e.title}：{e.val} 分
                        </p>
                    ))}
                </div>
            ) : ''}
        </Form>
    );
};

const WrappedForm = Form.create({
    name: "best_card_form"
})(DynamicFieldSet);

export default WrappedForm;
